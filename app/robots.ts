import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rethinkingbroken.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/thank-you', '/api/'],
        },
        sitemap: `${base}/sitemap.xml`
    }
}

export default robots;