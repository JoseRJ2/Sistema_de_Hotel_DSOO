import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const reglas = await withPrismaRetry(prisma =>
      prisma.$queryRaw<object[]>`SELECT * FROM ReglaUpgrade ORDER BY noches_desde ASC`
    );
    return NextResponse.json(reglas);
  } catch {
    return NextResponse.json({ error: 'Error al obtener reglas' }, { status: 500 });
  }
}
