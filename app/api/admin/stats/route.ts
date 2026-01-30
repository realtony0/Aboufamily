import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [productsCount, ordersCount, featuredCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products`,
      sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM products WHERE featured = true`
    ]) as any[];

    return NextResponse.json({
      totalProducts: Number((productsCount as any)[0]?.count || 0),
      pendingOrders: Number((ordersCount as any)[0]?.count || 0),
      featuredProducts: Number((featuredCount as any)[0]?.count || 0)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
