import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/aboubcfm', '/api/'],
      },
    ],
    sitemap: 'https://aboufamily.com/sitemap.xml',
  }
}
