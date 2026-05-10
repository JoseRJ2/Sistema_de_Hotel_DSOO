import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return NextResponse.json({ usuario: null });
    return NextResponse.json({ usuario: JSON.parse(sessionCookie.value) });
  } catch {
    return NextResponse.json({ usuario: null });
  }
}
