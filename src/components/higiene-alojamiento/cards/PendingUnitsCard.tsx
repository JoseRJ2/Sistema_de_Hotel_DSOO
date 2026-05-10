import PriorityBadge from "@/components/higiene-alojamiento/shared/PriorityBadge";
import StatusBadge from "@/components/higiene-alojamiento/shared/StatusBadge";
import type { PendingCleaningUnit } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface PendingUnitsCardProps {
  units: PendingCleaningUnit[];
}

export default function PendingUnitsCard({ units }: PendingUnitsCardProps) {
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
          </div>
        ))}
      </div>
    </article>
  );
}