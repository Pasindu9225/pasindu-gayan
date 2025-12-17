import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.pasindukawshalya.tech',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // If you add more public pages later (like /blog), you can add them here like this:
        // {
        //   url: 'https://www.pasindukawshalya.tech/blog',
        //   lastModified: new Date(),
        //   changeFrequency: 'weekly',
        //   priority: 0.8,
        // },
    ]
}