import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { FinalizarLimpieza } from "@/application/use-cases/higiene-alojamineto/FinalizarLimpieza";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new FinalizarLimpieza(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      usuarioPersonalId: Number(body.usuarioPersonalId),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Limpieza finalizada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST finalizar-limpieza:", error);

    return NextResponse.json(
      { message: "No fue posible finalizar la limpieza." },
      { status: 500 }
    );
  }
}