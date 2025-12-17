import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/private/'], // Protect your API routes from being indexed
        },
        sitemap: 'https://www.pasindukawshalya.tech/sitemap.xml',
    }
}