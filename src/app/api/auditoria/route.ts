import { NextResponse } from 'next/server';
import { withPrismaRetry } from '@/lib/prisma';

export async function GET() {
  try {
    const registros = await withPrismaRetry(prisma =>
      prisma.registroAuditoria.findMany({
        orderBy: { fecha_hora: 'desc' },
        take: 100,
      })
    );
    const mapeados = registros.map(r => ({
      ...r,
      fecha_hora: r.fecha_hora.toISOString().replace('T', ' ').slice(0, 16),
    }));
    return NextResponse.json(mapeados);
  } catch {
    return NextResponse.json({ error: 'Error al obtener auditoría' }, { status: 500 });
  }
}
