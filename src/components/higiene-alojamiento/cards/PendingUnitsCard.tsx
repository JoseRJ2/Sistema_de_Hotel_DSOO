"use client";

import PriorityBadge from "@/components/higiene-alojamiento/shared/PriorityBadge";
import StatusBadge from "@/components/higiene-alojamiento/shared/StatusBadge";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface PendingUnitsCardProps {
  units: PendingCleaningUnit[];
  onStartCleaning?: () => Promise<void>;
  onFinishCleaning?: () => Promise<void>;
}

export default function PendingUnitsCard({
  units,
  onStartCleaning,
  onFinishCleaning,
}: PendingUnitsCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Unidades pendientes
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Vista para personal de limpieza, priorizando villas premium.
      </p>

      <div className="mt-5 space-y-4">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="rounded-2xl border border-luxury-gold/20 bg-luxury-ivory p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-luxury-black">{unit.nombre}</p>
                <p className="text-sm text-luxury-charcoal/75">
                  {unit.tipoAlojamiento === "VILLA" ? "Villa" : "Habitación"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusBadge status={unit.estado} />
                <PriorityBadge priority={unit.prioridad} />
              </div>
            </div>

            {unit.horarioSugerido ? (
              <p className="mt-3 text-sm text-luxury-charcoal/75">
                Horario sugerido:{" "}
                <span className="font-semibold text-luxury-black">
                  {unit.horarioSugerido}
                </span>
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStartCleaning}
                className="rounded-xl bg-luxury-black px-4 py-2 text-sm font-semibold text-luxury-ivory transition hover:opacity-90"
              >
                Iniciar limpieza
              </button>

              <button
                type="button"
                onClick={onFinishCleaning}
                className="rounded-xl border border-luxury-gold/40 bg-white px-4 py-2 text-sm font-semibold text-luxury-black transition hover:bg-luxury-champagne/40"
              >
                Finalizar limpieza
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}