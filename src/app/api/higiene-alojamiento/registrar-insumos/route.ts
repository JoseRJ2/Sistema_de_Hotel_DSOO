import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { RegistrarInsumos } from "@/application/use-cases/higiene-alojamineto/RegistrarInsumos";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new RegistrarInsumos(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      insumos: body.insumos,
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Insumos registrados correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST registrar-insumos:", error);

    return NextResponse.json(
      { message: "No fue posible registrar los insumos." },
      { status: 500 }
    );
  }
}