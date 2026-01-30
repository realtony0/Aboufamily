import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
