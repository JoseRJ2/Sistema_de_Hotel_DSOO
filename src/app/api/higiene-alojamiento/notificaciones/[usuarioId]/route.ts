import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ObtenerNotificaciones } from "@/application/use-cases/higiene-alojamineto/ObtenerNotificaciones";

interface Params {
  params: Promise<{
    usuarioId: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const usuarioId = Number(resolvedParams.usuarioId);

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new ObtenerNotificaciones(repository);

    const result = await useCase.execute(usuarioId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en GET notificaciones:", error);

    return NextResponse.json(
      { message: "No fue posible obtener las notificaciones." },
      { status: 500 }
    );
  }
}