"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CLIENTE_ID = 1;

interface ReservaItem {
  id_reserva: number;
  id_cliente: number;
  fecha_check_in: string;
  fecha_check_out: string;
  estado: string;
  codigo_confirmacion?: string;
  Alojamiento?: {
    nombre: string;
    tipo: string;
  };
}

export default function ReservasDetallePage() {
  const [reservas, setReservas] = useState<ReservaItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/reservas", { cache: "no-store" });
      if (!res.ok) return;
      const data: ReservaItem[] = await res.json();
      setReservas(data);
    };

    void load();
  }, []);

  const reservasCliente = useMemo(
    () => reservas.filter((item) => item.id_cliente === CLIENTE_ID),
    [reservas]
  );

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mis proximas reservas</h1>
          <p className="mt-2 text-luxury-charcoal/70">Vista completa de tus reservas registradas.</p>
        </header>

        <section className="space-y-4">
          {reservasCliente.map((reserva) => (
            <article key={reserva.id_reserva} className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-luxury-black">{reserva.Alojamiento?.nombre ?? "Alojamiento"}</h2>
              <p className="mt-2 text-sm text-luxury-charcoal/70">Check-in: {new Date(reserva.fecha_check_in).toISOString().split("T")[0]}</p>
              <p className="text-sm text-luxury-charcoal/70">Check-out: {new Date(reserva.fecha_check_out).toISOString().split("T")[0]}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-luxury-charcoal/60">{reserva.estado} · {reserva.codigo_confirmacion ?? "Sin codigo"}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
