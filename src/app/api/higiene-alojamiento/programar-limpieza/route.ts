import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ProgramarLimpieza } from "@/application/use-cases/higiene-alojamineto/ProgramarLimpieza";
import { DesactivarProgramarLimpieza } from "@/application/use-cases/higiene-alojamineto/DesactivarProgramarLimpieza";
import { ObtenerResumenEstancia } from "@/application/use-cases/higiene-alojamineto/ObtenerResumenEstancia";

function toDateOnly(value: Date | string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().split("T")[0];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reservaId = Number(body.reservaId);
    const desactivar = Boolean(body.desactivar);

    const repository = new PrismaHigieneAlojamientoRepository();
    const resumenUseCase = new ObtenerResumenEstancia(repository);
    const resumen = await resumenUseCase.execute(reservaId);

    if (!resumen) {
      return NextResponse.json(
        { message: "No se encontro la reserva de la estancia." },
        { status: 404 }
      );
    }

    if (desactivar && resumen.preferenciaHigieneActiva === "PROGRAMAR_LIMPIEZA") {
      const useCase = new DesactivarProgramarLimpieza(repository);
      await useCase.execute({
        reservaId,
        observaciones:
          body.observaciones ??
          "Desactivado desde el panel del cliente.",
      });

      return NextResponse.json(
        {
          message:
            "Se desactivo la limpieza programada. El personal retomara limpieza rutinaria si no hay otra preferencia activa.",
          action: "deactivated",
        },
        { status: 200 }
      );
    }

    if (desactivar && resumen.preferenciaHigieneActiva !== "PROGRAMAR_LIMPIEZA") {
      return NextResponse.json(
        {
          message:
            "No habia una limpieza programada activa. Se mantiene limpieza rutinaria.",
          action: "noop",
        },
        { status: 200 }
      );
    }

    if (!body.fechaProgramada || !body.horarioProgramado) {
      return NextResponse.json(
        {
          message:
            "Para activar programar limpieza debes seleccionar fecha y horario.",
        },
        { status: 400 }
      );
    }

    const fechaProgramada = String(body.fechaProgramada);
    const fechaProgramadaOnly = toDateOnly(fechaProgramada);
    const checkinOnly = toDateOnly(resumen.fechaCheckin);
    const checkoutOnly = toDateOnly(resumen.fechaCheckout);

    if (!fechaProgramadaOnly || !checkinOnly || !checkoutOnly) {
      return NextResponse.json(
        {
          message:
            "No fue posible validar la fecha de limpieza. Intenta nuevamente.",
        },
        { status: 400 }
      );
    }

    if (
      fechaProgramadaOnly < checkinOnly ||
      fechaProgramadaOnly > checkoutOnly
    ) {
      return NextResponse.json(
        {
          message:
            "La fecha de limpieza debe estar dentro del periodo de tu hospedaje.",
        },
        { status: 400 }
      );
    }

    const useCase = new ProgramarLimpieza(repository);

    await useCase.execute({
      reservaId,
      fechaProgramada: fechaProgramadaOnly,
      horarioProgramado: body.horarioProgramado,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      {
        message: "La limpieza fue programada correctamente.",
        action: "activated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST programar-limpieza:", error);

    return NextResponse.json(
      { message: "No fue posible actualizar la programacion de limpieza." },
      { status: 500 }
    );
  }
}
