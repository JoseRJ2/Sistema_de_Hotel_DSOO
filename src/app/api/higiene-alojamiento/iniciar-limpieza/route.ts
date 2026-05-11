import { NextResponse } from "next/server";
import { PrismaHigieneAlojamientoRepository } from "@/infrastructure/repositories/PrismaHigieneAlojamientoRepository";
import { IniciarLimpieza } from "@/application/use-cases/higiene-alojamineto/IniciarLimpieza";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaHigieneAlojamientoRepository();
    const useCase = new IniciarLimpieza(repository);

    await useCase.execute({
      reservaId: Number(body.reservaId),
      usuarioPersonalId: Number(body.usuarioPersonalId),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Limpieza iniciada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST iniciar-limpieza:", error);

    return NextResponse.json(
      { message: "No fue posible iniciar la limpieza." },
      { status: 500 }
    );
  }
}