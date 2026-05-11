import { NextResponse } from "next/server";
import { ObtenerCatalogoAmenidades } from "@/application/use-cases/reserva-amenidades/ObtenerCatalogoAmenidades";
import { PrismaReservaAmenidadRepository } from "@/infrastructure/repositories/PrismaReservaAmenidadRepository";

export async function GET() {
  try {
    const repository = new PrismaReservaAmenidadRepository();
    const useCase = new ObtenerCatalogoAmenidades(repository);

    const result = await useCase.execute();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en GET catalogo amenidades:", error);

    return NextResponse.json(
      { message: "No fue posible obtener el catálogo de amenidades." },
      { status: 500 }
    );
  }
}