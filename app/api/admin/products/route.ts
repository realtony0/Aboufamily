import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer tous les produits
export async function GET() {
  try {
    // Vérifier que DATABASE_URL est configuré
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json(
        { error: 'Database not configured', products: [] },
        { status: 503 }
      );
    }

    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    ` as any[];
    
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      mainCategory,
      category,
      price,
      description,
      image,
      images,
      inStock,
      featured
    } = body;

    const result = await sql`
      INSERT INTO products (
        id, name, main_category, category, price, description, 
        image, images, in_stock, featured
      )
      VALUES (
        ${id}, ${name}, ${mainCategory}, ${category}, ${price}, 
        ${description}, ${image}, ${images || []}, ${inStock ?? true}, ${featured ?? false}
      )
      RETURNING *
    ` as any[];

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
