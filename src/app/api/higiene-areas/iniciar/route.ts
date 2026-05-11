import { NextResponse } from "next/server";
import { IniciarHigieneArea } from "@/application/use-cases/higiene-areas/IniciarHigieneArea";
import { PrismaHigieneAreaRepository } from "@/infrastructure/repositories/PrismaHigieneAreaRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAreaRepository();
    const useCase = new IniciarHigieneArea(repository);

    await useCase.execute({
      areaId: Number(body.areaId),
      usuarioPersonalId: Number(body.usuarioPersonalId),
      tipoHigiene: body.tipoHigiene,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Higiene de área iniciada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST higiene-areas/iniciar:", error);

    return NextResponse.json(
      { message: "No fue posible iniciar la higiene del área." },
      { status: 500 }
    );
  }
}