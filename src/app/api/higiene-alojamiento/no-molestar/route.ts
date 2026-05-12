import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ActivarNoMolestar } from "@/application/use-cases/higiene-alojamineto/ActivarNoMolestar";
import { DesactivarNoMolestar } from "@/application/use-cases/higiene-alojamineto/DesactivarNoMolestar";
import { ObtenerResumenEstancia } from "@/application/use-cases/higiene-alojamineto/ObtenerResumenEstancia";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reservaId = Number(body.reservaId);

    const repository = new PrismaHigieneAlojamientoRepository();
    const resumenUseCase = new ObtenerResumenEstancia(repository);
    const resumen = await resumenUseCase.execute(reservaId);

    if (!resumen) {
      return NextResponse.json(
        { message: "No se encontro la reserva de la estancia." },
        { status: 404 }
      );
    }

    if (resumen.preferenciaHigieneActiva === "NO_MOLESTAR") {
      const useCase = new DesactivarNoMolestar(repository);
      await useCase.execute({
        reservaId,
        observaciones:
          body.observaciones ??
          "Desactivado desde el panel del cliente.",
      });

      return NextResponse.json(
        {
          message:
            "Modo No Molestar desactivado. El personal retomara limpieza rutinaria si no hay otra preferencia activa.",
          action: "deactivated",
        },
        { status: 200 }
      );
    }

    const useCase = new ActivarNoMolestar(repository);
    await useCase.execute({
      reservaId,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      {
        message: "Modo No Molestar activado correctamente.",
        action: "activated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST no-molestar:", error);

    return NextResponse.json(
      { message: "No fue posible actualizar el modo No Molestar." },
      { status: 500 }
    );
  }
}
