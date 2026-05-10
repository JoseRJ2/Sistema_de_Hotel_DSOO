import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { ActivarNoMolestar } from "@/application/use-cases/higiene-alojamineto/ActivarNoMolestar";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new ActivarNoMolestar(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Modo No Molestar activado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST no-molestar:", error);

    return NextResponse.json(
      { message: "No fue posible activar el modo No Molestar." },
      { status: 500 }
    );
  }
}