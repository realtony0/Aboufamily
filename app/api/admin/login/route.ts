import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Vérifier les credentials (pour simplifier, on utilise les variables d'env)
    const adminUsername = process.env.ADMIN_USERNAME || 'aboubcfm';
    const adminPassword = process.env.ADMIN_PASSWORD || 'kinderelnutella1';

    if (username === adminUsername && password === adminPassword) {
      // Créer une session simple (en production, utilisez NextAuth)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
        username
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
