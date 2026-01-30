import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [productsCount, ordersCount, featuredCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products`,
      sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM products WHERE featured = true`
    ]);

    return NextResponse.json({
      totalProducts: Number(productsCount[0].count),
      pendingOrders: Number(ordersCount[0].count),
      featuredProducts: Number(featuredCount[0].count)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
