import { NextRequest, NextResponse } from 'next/server';

export const middleware = (req: NextRequest) => {
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {

        if (pathname === '/admin/login' || pathname === '/api/admin/login') {
            return NextResponse.next()
        }

        const token = req.cookies.get('admin_token')?.value
        if (token !== process.env.ADMIN_SECRET) {
            if (pathname.startsWith('/api/admin')) {
                return NextResponse.json({ error: 'Unauthorized'}, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', req.url))
        }
    }

    return NextResponse.next()
};

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}

