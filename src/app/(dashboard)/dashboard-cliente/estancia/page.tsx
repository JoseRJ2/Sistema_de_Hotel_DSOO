"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StaySummaryCard from "@/components/higiene-alojamiento/cards/StaySummaryCard";
import type { StaySummary } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

const RESERVA_ID = 1;

function mapBackendStatusToFrontendStatus(
  estadoGeneral: string,
  estadoHigiene: string,
  privacidadActiva: boolean
): StaySummary["estado"] {
  if (privacidadActiva || estadoGeneral === "NO_MOLESTAR") return "NO_MOLESTAR";

  switch (estadoHigiene) {
    case "PROGRAMADA": return "PROGRAMADA";
    case "EN_ESPERA": return "EN_ESPERA";
    case "EN_LIMPIEZA": return "EN_LIMPIEZA";
    case "REPOSICION_INSUMOS": return "REPOSICION_INSUMOS";
    case "LIMPIA": return "LIMPIA";
    case "SUCIA": return "SUCIA";
    default: return "SOLICITUD_RECIBIDA";
  }
}

export default function EstanciaDetallePage() {
  const [staySummary, setStaySummary] = useState<StaySummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/higiene-alojamiento/resumen/${RESERVA_ID}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      setStaySummary({
        id: String(data.alojamientoId),
        nombre: data.nombreAlojamiento,
        tipoAlojamiento: data.tipoAlojamiento.includes("VILLA") ? "VILLA" : "HABITACION",
        tipoCliente: data.rolCliente.includes("VIP") ? "VIP" : data.rolCliente.includes("PREMIUM") ? "PREMIUM" : "ESTANDAR",
        estado: mapBackendStatusToFrontendStatus(data.estadoGeneral, data.estadoHigiene, data.privacidadActiva),
        privacidadActiva: data.privacidadActiva,
        prioridad: data.tipoAlojamiento.includes("VILLA"),
        reservaActiva: true,
        fechaCheckIn: new Date(data.fechaCheckin).toISOString().split("T")[0],
        fechaCheckOut: new Date(data.fechaCheckout).toISOString().split("T")[0],
      });
    };

    void load();
  }, []);

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mi estancia actual</h1>
          <p className="mt-2 text-luxury-charcoal/70">Vista completa del estado de tu alojamiento.</p>
        </header>
        {staySummary ? <StaySummaryCard stay={staySummary} /> : null}
      </div>
    </main>
  );
}
