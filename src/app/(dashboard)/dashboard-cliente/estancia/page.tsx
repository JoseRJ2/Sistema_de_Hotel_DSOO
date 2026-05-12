"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StaySummaryCard from "@/components/higiene-alojamiento/cards/StaySummaryCard";
import type { StaySummary } from "@/types/higiene-alojamiento/higiene-alojamiento.types";
import { useDashboardClienteContext } from "@/hooks/useDashboardClienteContext";

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
  const { usuario, reservaId, loading: contextLoading, sessionReady } =
    useDashboardClienteContext();
  const [staySummary, setStaySummary] = useState<StaySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!reservaId) {
        setStaySummary(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch(`/api/higiene-alojamiento/resumen/${reservaId}`, { cache: "no-store" });
      if (!res.ok) {
        setErrorMessage("No fue posible cargar el resumen de tu estancia.");
        setIsLoading(false);
        return;
      }
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
      setIsLoading(false);
    };

    if (!contextLoading) {
      void load();
    }
  }, [reservaId, contextLoading]);

  if (contextLoading) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando sesion del cliente...
          </div>
        </div>
      </main>
    );
  }

  if (!sessionReady || !usuario) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl text-luxury-black">
              Acceso restringido
            </h1>
            <p className="mt-2 text-luxury-charcoal/70">
              Inicia sesion como cliente para ver tu estancia.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-luxury-black px-5 py-2 text-sm font-semibold text-luxury-ivory"
            >
              Ir a iniciar sesion
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mi estancia actual</h1>
          <p className="mt-2 text-luxury-charcoal/70">Vista completa del estado de tu alojamiento.</p>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando estancia...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && !staySummary ? (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 text-sm text-luxury-charcoal/75">
            No encontramos una reserva activa para mostrar tu estancia.
          </div>
        ) : null}

        {staySummary ? <StaySummaryCard stay={staySummary} /> : null}
      </div>
    </main>
  );
}
