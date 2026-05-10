import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await withPrismaRetry(prisma =>
      prisma.rol.findMany({ orderBy: { id_rol: 'asc' } })
    );
    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
  }
}
