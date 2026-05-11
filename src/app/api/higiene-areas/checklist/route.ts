import { NextResponse } from "next/server";
import { RegistrarChecklistArea } from "@/application/use-cases/higiene-areas/RegistrarChecklistArea";
import { PrismaHigieneAreaRepository } from "@/infrastructure/repositories/PrismaHigieneAreaRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAreaRepository();
    const useCase = new RegistrarChecklistArea(repository);

    await useCase.execute({
      areaId: Number(body.areaId),
      tareas: body.tareas,
    });

    return NextResponse.json(
      { message: "Checklist registrado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST higiene-areas/checklist:", error);

    return NextResponse.json(
      { message: "No fue posible registrar el checklist." },
      { status: 500 }
    );
  }
}