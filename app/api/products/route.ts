import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer tous les produits (API publique)
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      // Fallback vers le fichier statique si DB pas configurée
      const { products } = await import('@/data/products');
      return NextResponse.json(products);
    }

    const products = await sql`
      SELECT 
        id,
        name,
        main_category as "mainCategory",
        category,
        price,
        description,
        image,
        COALESCE(images, ARRAY[]::TEXT[]) as images,
        in_stock as "inStock",
        COALESCE(featured, false) as featured
      FROM products 
      ORDER BY featured DESC, created_at DESC
    ` as any[];

    // S'assurer que images est toujours un tableau
    const formattedProducts = (products || []).map((p: any) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback vers le fichier statique en cas d'erreur
    try {
      const { products } = await import('@/data/products');
      return NextResponse.json(products);
    } catch {
      return NextResponse.json([], { status: 500 });
    }
  }
}
