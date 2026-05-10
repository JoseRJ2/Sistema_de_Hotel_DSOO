import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { SaltarLimpiezaHoy } from "@/application/use-cases/higiene-alojamineto/SaltarLimpiezaHoy";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new SaltarLimpiezaHoy(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "La limpieza de hoy fue omitida correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST saltar-limpieza:", error);

    return NextResponse.json(
      { message: "No fue posible omitir la limpieza de hoy." },
      { status: 500 }
    );
  }
}