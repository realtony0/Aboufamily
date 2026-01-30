import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { products } from '@/data/products';

export async function POST() {
  try {
    // Vérifier que DATABASE_URL est configuré
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'Veuillez configurer la variable d\'environnement DATABASE_URL dans les paramètres Vercel. Allez dans Settings > Environment Variables et ajoutez votre connection string Neon PostgreSQL.'
        },
        { status: 503 }
      );
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        // Vérifier si le produit existe déjà
        const existing = await sql`
          SELECT id FROM products WHERE id = ${product.id}
        ` as any[];

        if (existing.length === 0) {
          await sql`
            INSERT INTO products (
              id, name, main_category, category, price, description, 
              image, images, in_stock, featured
            )
            VALUES (
              ${product.id},
              ${product.name},
              ${product.mainCategory},
              ${product.category},
              ${product.price},
              ${product.description},
              ${product.image},
              ${product.images || []},
              ${product.inStock ?? true},
              ${product.featured ?? false}
            )
          `;
          imported++;
        } else {
          skipped++;
        }
      } catch (error: any) {
        errors.push(`${product.name}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products', message: error.message },
      { status: 500 }
    );
  }
}
