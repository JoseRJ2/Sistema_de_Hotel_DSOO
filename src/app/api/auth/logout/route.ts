import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('session', '', { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 0, path: '/' });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
