"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDashboardClienteContext } from "@/hooks/useDashboardClienteContext";

interface ReservaItem {
  id: string;
  tipo: "ALOJAMIENTO" | "AMENIDAD";
  titulo: string;
  subtitulo: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: string;
  referencia?: string;
}

export default function ReservasDetallePage() {
  const { usuario, clienteId, loading: contextLoading, sessionReady } =
    useDashboardClienteContext();
  const [reservas, setReservas] = useState<ReservaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!clienteId) {
        setReservas([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await fetch(
          `/api/dashboard-cliente/reservas-pendientes/${clienteId}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("No fue posible cargar tus reservas pendientes.");
        }

        const data: ReservaItem[] = await res.json();
        setReservas(data);
      } catch (error) {
        console.error("Error al cargar reservas del cliente:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No fue posible cargar tus reservas pendientes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!contextLoading) {
      void load();
    }
  }, [clienteId, contextLoading]);

  const reservasCliente = useMemo(() => reservas, [reservas]);

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
              Inicia sesion como cliente para ver tus reservas.
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
        <Link
          href="/dashboard-cliente"
          className="text-sm font-semibold text-luxury-gold"
        >
          Volver al dashboard
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">
            Mis proximas reservas
          </h1>
          <p className="mt-2 text-luxury-charcoal/70">
            Aqui veras tus reservas pendientes y confirmadas proximas.
          </p>
        </header>

        {isLoading ? (
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando reservas...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {errorMessage}
          </div>
        ) : null}

        <section className="space-y-4">
          {reservasCliente.map((reserva) => (
            <article
              key={reserva.id}
              className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-luxury-charcoal/60">
                {reserva.tipo}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-luxury-black">
                {reserva.titulo}
              </h2>
              <p className="mt-1 text-sm text-luxury-charcoal/70">
                {reserva.subtitulo}
              </p>
              <p className="mt-3 text-sm text-luxury-charcoal/75">
                Fecha: {reserva.fechaInicio}
                {reserva.fechaFin ? ` - Salida: ${reserva.fechaFin}` : ""}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-luxury-charcoal/60">
                {reserva.estado}
                {reserva.referencia ? ` - ${reserva.referencia}` : ""}
              </p>
            </article>
          ))}

          {!isLoading && !errorMessage && reservasCliente.length === 0 ? (
            <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 text-sm text-luxury-charcoal/75">
              No tienes reservas pendientes por ahora.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
