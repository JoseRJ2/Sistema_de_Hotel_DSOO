import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const alojamientos = await withPrismaRetry(prisma =>
      prisma.alojamiento.findMany({ orderBy: { id_alojamiento: 'asc' } })
    );
    return NextResponse.json(alojamientos);
  } catch {
    return NextResponse.json({ error: 'Error al obtener alojamientos' }, { status: 500 });
  }
}
