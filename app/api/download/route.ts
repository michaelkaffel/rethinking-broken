import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getR2Key = (productType: string): string | null => {
    if (productType === 'ebook') return process.env.R2_EBOOK_KEY!;
    if (productType === 'audiobook') return process.env.R2_AUDIOBOOK_KEY!;
    return null
};

export const GET = async (req: NextRequest) => {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Look up token in DB
    const { data: tokenRow, error } = await supabase
        .from('download_tokens')
        .select('*')
        .eq('token', token)
        .single()

    if (error || !tokenRow) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    };

    // Check expiry
    if (new Date(tokenRow.expires_at) < new Date()) {
        return NextResponse.json(
            { error: 'This download link has expired. Please contact support by emailing help@rethinkingbroken.com' },
            { status: 400 }
        )
    };

    // Resolve R2 key
    const r2Key = getR2Key(tokenRow.product_type)
    if (!r2Key) {
        return NextResponse.json({ error: 'Unknown product type'}, { status: 400 });
    };


    // Generate short-lived presigned URL (15 mins)
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: r2Key,
        ResponseContentDisposition: `attachment; filename="Rethinking-Broken-${tokenRow.product_type}.${r2Key.split('.').pop()}"`
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    // Increment used_count for audit trail
    await supabase
        .from('download_tokens')
        .update({ used_count: tokenRow.used_count + 1 })
        .eq('token', token)

    // Redirect to presigned URL
    return NextResponse.redirect(presignedUrl);
}