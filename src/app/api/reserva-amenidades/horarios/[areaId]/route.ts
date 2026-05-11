import { NextResponse } from "next/server";
import { ObtenerHorariosAmenidad } from "@/application/use-cases/reserva-amenidades/ObtenerHorariosAmenidad";
import { PrismaReservaAmenidadRepository } from "@/infrastructure/repositories/PrismaReservaAmenidadRepository";

interface Params {
  params: Promise<{
    areaId: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const areaId = Number(resolvedParams.areaId);

    const repository = new PrismaReservaAmenidadRepository();
    const useCase = new ObtenerHorariosAmenidad(repository);

    const result = await useCase.execute(areaId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en GET horarios amenidad:", error);

    return NextResponse.json(
      { message: "No fue posible obtener los horarios de la amenidad." },
      { status: 500 }
    );
  }
}