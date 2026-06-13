import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rethinkingbroken.com'

    return [
        { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
        { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/shop/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/shop/ebook`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/shop/audiobook`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ]
};

export default sitemap;