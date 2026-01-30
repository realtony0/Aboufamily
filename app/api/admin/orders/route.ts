import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer toutes les commandes
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      return NextResponse.json([]);
    }

    const status = request.nextUrl.searchParams.get('status');
    
    let query = sql`SELECT * FROM orders ORDER BY created_at DESC`;
    if (status) {
      query = sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`;
    }

    const orders = await query as any[];
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([]);
  }
}

// POST - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, items, total_price, notes } = body;

    const result = await sql`
      INSERT INTO orders (customer_name, customer_phone, items, total_price, notes)
      VALUES (${customer_name}, ${customer_phone}, ${JSON.stringify(items)}, ${total_price}, ${notes || ''})
      RETURNING *
    ` as any[];

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
