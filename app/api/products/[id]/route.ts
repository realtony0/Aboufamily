import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer un produit par ID (API publique)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      // Fallback vers le fichier statique
      const { getProductById } = await import('@/data/products');
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const result = await sql`
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
      WHERE id = ${id}
    ` as any[];

    if (!result || result.length === 0) {
      // Fallback vers le fichier statique
      const { getProductById } = await import('@/data/products');
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // S'assurer que images est toujours un tableau
    const product = {
      ...result[0],
      images: Array.isArray(result[0].images) ? result[0].images : [],
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback vers le fichier statique
    try {
      const { id } = await params;
      const { getProductById } = await import('@/data/products');
      const product = getProductById(id);
      if (product) {
        return NextResponse.json(product);
      }
    } catch {}
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
