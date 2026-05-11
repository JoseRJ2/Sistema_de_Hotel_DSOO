import AreaStatusBadge from "@/components/higiene-areas/shared/AreaStatusBadge";
import type { AreaComunItem } from "@/types/higiene-areas/higiene-areas.types";

interface AreaSummaryCardProps {
  area: AreaComunItem;
  onSelect?: (area: AreaComunItem) => void;
}

export default function AreaSummaryCard({ area, onSelect }: AreaSummaryCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-charcoal/60">
            {area.tipo}
          </p>

          <h3 className="mt-2 font-serif text-2xl text-luxury-black">
            {area.nombre}
          </h3>

          <p className="mt-2 text-sm text-luxury-charcoal/75">
            Capacidad máxima: {area.capacidadMaxima} personas
          </p>
        </div>

        <AreaStatusBadge status={area.estado} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Última limpieza
          </p>
          <p className="mt-2 font-semibold text-luxury-black">
            {area.ultimaLimpieza}
          </p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Próxima ronda
          </p>
          <p className="mt-2 font-semibold text-luxury-black">
            {area.proximaRonda}
          </p>
        </div>
      </div>

      {area.esPasoCritico ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Área de paso crítico. Evitar bloqueo en horario pico de check-in.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect?.(area)}
        className="mt-5 rounded-xl bg-luxury-black px-5 py-3 text-sm font-semibold text-luxury-ivory transition hover:opacity-90"
      >
        Gestionar área
      </button>
    </article>
  );
}