import { MetadataRoute } from 'next'
import { sql } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aboufamily.com'
  
  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publicite`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/livraison-express`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/commandes-cadeaux`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/devenir-partenaire`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Pages produits dynamiques depuis la DB
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')) {
      const products = await sql`
        SELECT id, updated_at FROM products
      ` as any[];
      
      productPages = products.map((product) => ({
        url: `${baseUrl}/produit/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } else {
      // Fallback vers le fichier statique
      const { products } = await import('@/data/products');
      productPages = products.map((product) => ({
        url: `${baseUrl}/produit/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    // Fallback vers le fichier statique en cas d'erreur
    try {
      const { products } = await import('@/data/products');
      productPages = products.map((product) => ({
        url: `${baseUrl}/produit/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch {
      // Si même le fallback échoue, on retourne juste les pages statiques
    }
  }

  return [...staticPages, ...productPages]
}
