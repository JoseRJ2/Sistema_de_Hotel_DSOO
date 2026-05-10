import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const beneficios = await withPrismaRetry(prisma =>
      prisma.beneficio.findMany({ include: { Rol: true } })
    );
    return NextResponse.json(beneficios);
  } catch {
    return NextResponse.json({ error: 'Error al obtener beneficios' }, { status: 500 });
  }
}
