import { NextResponse } from "next/server";
import { FinalizarHigieneArea } from "@/application/use-cases/higiene-areas/FinalizarHigieneArea";
import { PrismaHigieneAreaRepository } from "@/infrastructure/repositories/PrismaHigieneAreaRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAreaRepository();
    const useCase = new FinalizarHigieneArea(repository);

    await useCase.execute({
      areaId: Number(body.areaId),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Área liberada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST higiene-areas/finalizar:", error);

    return NextResponse.json(
      { message: "No fue posible finalizar la higiene del área." },
      { status: 500 }
    );
  }
}