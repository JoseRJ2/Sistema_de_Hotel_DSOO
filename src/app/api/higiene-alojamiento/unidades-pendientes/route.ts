import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ObtenerUnidadesPendientes } from "@/application/use-cases/higiene-alojamineto/ObtenerUnidadesPendientes";

export async function GET() {
  try {
    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new ObtenerUnidadesPendientes(repository);

    const result = await useCase.execute();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en GET unidades-pendientes:", error);

    return NextResponse.json(
      { message: "No fue posible obtener las unidades pendientes." },
      { status: 500 }
    );
  }
}