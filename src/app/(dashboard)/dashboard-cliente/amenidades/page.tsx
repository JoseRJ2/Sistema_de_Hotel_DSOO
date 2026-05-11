"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AmenityItem } from "@/types/reserva-amenidades/reserva-amenidades.types";

export default function AmenidadesDetallePage() {
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/reserva-amenidades/catalogo", { cache: "no-store" });
      if (!res.ok) return;
      const data: AmenityItem[] = await res.json();
      setAmenities(data);
    };

    void load();
  }, []);

  const disponibles = useMemo(
    () => amenities.filter((item) => item.estado?.toUpperCase() === "DISPONIBLE"),
    [amenities]
  );

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mis amenidades disponibles</h1>
          <p className="mt-2 text-luxury-charcoal/70">Catalogo completo de amenidades activas para reservar.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {disponibles.map((amenity) => (
            <article key={amenity.id} className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl text-luxury-black">{amenity.nombre}</h2>
              <p className="mt-2 text-luxury-charcoal/70">{amenity.descripcion}</p>
              <p className="mt-4 text-sm text-luxury-charcoal/70">{amenity.tipo} · Capacidad: {amenity.capacidad} personas</p>
            </article>
          ))}
        </section>

        <Link href="/reserva-amenidades" className="inline-block rounded-xl bg-luxury-gold px-6 py-3 text-sm font-semibold text-luxury-black">
          Ir al modulo de reserva
        </Link>
      </div>
    </main>
  );
}
