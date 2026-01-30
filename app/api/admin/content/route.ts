import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Récupérer tout le contenu ou filtrer par page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    let query;
    if (page && section) {
      query = sql`
        SELECT * FROM site_content 
        WHERE page = ${page} AND section = ${section}
        ORDER BY key
      `;
    } else if (page) {
      query = sql`
        SELECT * FROM site_content 
        WHERE page = ${page}
        ORDER BY section, key
      `;
    } else {
      query = sql`
        SELECT * FROM site_content 
        ORDER BY page, section, key
      `;
    }

    const content = await query as any[];
    return NextResponse.json(content || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch content', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour du contenu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, section, key, content, type = 'text' } = body;

    if (!page || !section || !key || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: page, section, key, content' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO site_content (page, section, key, content, type)
      VALUES (${page}, ${section}, ${key}, ${content}, ${type})
      ON CONFLICT (page, section, key)
      DO UPDATE SET 
        content = EXCLUDED.content,
        type = EXCLUDED.type,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    ` as any[];

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to save content', message: error.message },
      { status: 500 }
    );
  }
}
