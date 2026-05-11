import { NextResponse } from "next/server";
import { PrismaHigieneAreaRepository } from "@/infrastructure/repositories/PrismaHigieneAreaRepository";
import { ObtenerAreas } from "@/application/use-cases/higiene-areas/ObtenerAreas";

export async function GET() {
  try {
    const repo = new PrismaHigieneAreaRepository();
    const useCase = new ObtenerAreas(repo);

    const result = await useCase.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener áreas" },
      { status: 500 }
    );
  }
}