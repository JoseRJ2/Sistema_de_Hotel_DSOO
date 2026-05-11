import ClientLevelBadge from "@/components/reserva-amenidades/shared/ClientLevelBadge";
import type { ReservationSummary } from "@/types/reserva-amenidades/reserva-amenidades.types";

interface ReservationSummaryCardProps {
  summary: ReservationSummary | null;
}

export default function ReservationSummaryCard({
  summary,
}: ReservationSummaryCardProps) {
  return (
    <article className="rounded-[2rem] border border-luxury-gold/20 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-3xl text-luxury-black">
        Resumen de reservación
      </h3>

      {!summary ? (
        <p className="mt-3 text-sm text-luxury-charcoal/75">
          Aún no hay una solicitud confirmada. Completa el formulario para ver
          el resumen.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-luxury-champagne/25 p-4">
            <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
              Amenidad
            </p>
            <p className="mt-2 font-semibold text-luxury-black">
              {summary.amenidad}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-luxury-champagne/25 p-4">
              <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
                Fecha
              </p>
              <p className="mt-2 font-semibold text-luxury-black">
                {summary.fecha}
              </p>
            </div>

            <div className="rounded-2xl bg-luxury-champagne/25 p-4">
              <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
                Horario
              </p>
              <p className="mt-2 font-semibold text-luxury-black">
                {summary.horario}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ClientLevelBadge level={summary.nivelCliente} />

            <span className="rounded-full border border-luxury-gold/30 bg-luxury-champagne/30 px-4 py-2 text-xs font-semibold text-luxury-black">
              {summary.invitados} invitado(s)
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
              {summary.estado}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}