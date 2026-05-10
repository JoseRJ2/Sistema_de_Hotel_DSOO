import PriorityBadge from "@/components/higiene-alojamiento/shared/PriorityBadge";
import StatusBadge from "@/components/higiene-alojamiento/shared/StatusBadge";
import type { StaySummary } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface StaySummaryCardProps {
  stay: StaySummary;
}

export default function StaySummaryCard({ stay }: StaySummaryCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-luxury-charcoal/60">
            Resumen de estancia
          </p>
          <h3 className="mt-2 font-serif text-3xl text-luxury-black">
            {stay.nombre}
          </h3>
          <p className="mt-2 text-sm text-luxury-charcoal/80">
            {stay.tipoAlojamiento === "VILLA" ? "Villa" : "Habitación"} · Cliente{" "}
            {stay.tipoCliente}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={stay.estado} />
          <PriorityBadge priority={stay.prioridad} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Reserva activa
          </p>
          <p className="mt-2 font-semibold text-luxury-black">
            {stay.reservaActiva ? "Sí" : "No"}
          </p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Privacidad
          </p>
          <p className="mt-2 font-semibold text-luxury-black">
            {stay.privacidadActiva ? "Activada" : "Desactivada"}
          </p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Check-in
          </p>
          <p className="mt-2 font-semibold text-luxury-black">{stay.fechaCheckIn}</p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/35 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Check-out
          </p>
          <p className="mt-2 font-semibold text-luxury-black">{stay.fechaCheckOut}</p>
        </div>
      </div>
    </article>
  );
}