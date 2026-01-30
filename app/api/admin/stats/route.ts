import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Vérifier que DATABASE_URL est configuré
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({
        totalProducts: 0,
        pendingOrders: 0,
        featuredProducts: 0
      });
    }

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
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalProducts: 0,
      pendingOrders: 0,
      featuredProducts: 0
    });
  }
}
