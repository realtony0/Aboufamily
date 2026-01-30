import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// API publique pour récupérer le contenu éditorial
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      return NextResponse.json({});
    }

    let query;
    if (page && section) {
      query = sql`
        SELECT key, content, type FROM site_content 
        WHERE page = ${page} AND section = ${section}
      `;
    } else if (page) {
      query = sql`
        SELECT section, key, content, type FROM site_content 
        WHERE page = ${page}
      `;
    } else {
      return NextResponse.json({ error: 'page parameter required' }, { status: 400 });
    }

    const content = await query as any[];
    
    // Transformer en objet clé-valeur
    const contentMap: Record<string, any> = {};
    content.forEach((item: any) => {
      if (section) {
        contentMap[item.key] = item.type === 'json' ? JSON.parse(item.content) : item.content;
      } else {
        if (!contentMap[item.section]) {
          contentMap[item.section] = {};
        }
        contentMap[item.section][item.key] = item.type === 'json' ? JSON.parse(item.content) : item.content;
      }
    });

    return NextResponse.json(contentMap);
  } catch (error: any) {
    return NextResponse.json({}, { status: 200 }); // Retourner objet vide en cas d'erreur
  }
}
