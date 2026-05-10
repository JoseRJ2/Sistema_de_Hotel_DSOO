import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ObtenerResumenEstancia } from "@/application/use-cases/higiene-alojamineto/ObtenerResumenEstancia";

interface Params {
  params: Promise<{
    reservaId: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const reservaId = Number(resolvedParams.reservaId);

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new ObtenerResumenEstancia(repository);

    const result = await useCase.execute(reservaId);

    if (!result) {
      return NextResponse.json(
        { message: "No se encontró la reserva." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en GET resumen:", error);

    return NextResponse.json(
      { message: "Ocurrió un error al obtener el resumen de la estancia." },
      { status: 500 }
    );
  }
}