import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// PUT - Mettre à jour une publicité
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image, link, active, position } = body;

    const result = await sql`
      UPDATE ads
      SET title = ${title},
          description = ${description || ''},
          image = ${image || ''},
          link = ${link || ''},
          active = ${active ?? true},
          position = ${position || 'homepage'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as any[];

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { error: 'Failed to update ad' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une publicité
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM ads WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    );
  }
}
