import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ProgramarLimpieza } from "@/application/use-cases/higiene-alojamineto/ProgramarLimpieza";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new ProgramarLimpieza(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      fechaProgramada: body.fechaProgramada,
      horarioProgramado: body.horarioProgramado,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "La limpieza fue programada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST programar-limpieza:", error);

    return NextResponse.json(
      { message: "No fue posible programar la limpieza." },
      { status: 500 }
    );
  }
}