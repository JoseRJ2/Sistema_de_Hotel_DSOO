import { NextResponse } from "next/server";
import { ProgramarHigieneArea } from "@/application/use-cases/higiene-areas/ProgramarHigieneArea";
import { PrismaHigieneAreaRepository } from "@/infrastructure/repositories/PrismaHigieneAreaRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAreaRepository();
    const useCase = new ProgramarHigieneArea(repository);

    await useCase.execute({
      areaId: Number(body.areaId),
      usuarioAsignadoId: Number(body.usuarioAsignadoId),
      tipoHigiene: body.tipoHigiene,
      fechaProgramada: body.fechaProgramada,
      horaProgramada: body.horaProgramada,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Ronda de higiene programada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST higiene-areas/programar:", error);

    return NextResponse.json(
      { message: "No fue posible programar la ronda de higiene." },
      { status: 500 }
    );
  }
}