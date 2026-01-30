import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer toutes les publicités
export async function GET() {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      return NextResponse.json([]);
    }

    const ads = await sql`
      SELECT * FROM ads ORDER BY created_at DESC
    ` as any[];
    
    return NextResponse.json(ads || []);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json([]);
  }
}

// POST - Créer une nouvelle publicité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, link, active, position } = body;

    const result = await sql`
      INSERT INTO ads (title, description, image, link, active, position)
      VALUES (${title}, ${description || ''}, ${image || ''}, ${link || ''}, ${active ?? true}, ${position || 'homepage'})
      RETURNING *
    ` as any[];

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}
