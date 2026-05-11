import { NextResponse } from "next/server";
import { ReservarAmenidad } from "@/application/use-cases/reserva-amenidades/ReservarAmenidad";
import { PrismaReservaAmenidadRepository } from "@/infrastructure/repositories/PrismaReservaAmenidadRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const repository = new PrismaReservaAmenidadRepository();
    const useCase = new ReservarAmenidad(repository);

    await useCase.execute({
      clienteId: Number(body.clienteId),
      areaId: Number(body.areaId),
      horarioId: Number(body.horarioId),
      fechaReserva: body.fechaReserva,
      cantidadPersonas: Number(body.cantidadPersonas),
      observaciones: body.observaciones,
    });

    return NextResponse.json(
      { message: "Reserva de amenidad confirmada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST reservar amenidad:", error);

    return NextResponse.json(
      { message: "No fue posible confirmar la reserva de amenidad." },
      { status: 500 }
    );
  }
}