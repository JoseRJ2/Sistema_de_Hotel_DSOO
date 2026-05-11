import AmenityStatusBadge from "@/components/reserva-amenidades/shared/AmenityStatusBadge";
import type { AmenityItem } from "@/types/reserva-amenidades/reserva-amenidades.types";

interface AmenityDetailCardProps {
  amenity: AmenityItem;
}

export default function AmenityDetailCard({ amenity }: AmenityDetailCardProps) {
  return (
    <article className="rounded-[2rem] border border-luxury-gold/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal/60">
            {amenity.tipo}
          </p>

          <h3 className="mt-3 font-serif text-4xl text-luxury-black">
            {amenity.nombre}
          </h3>
        </div>

        <AmenityStatusBadge status={amenity.estado} />
      </div>

      <p className="mt-5 text-sm leading-6 text-luxury-charcoal/80">
        {amenity.descripcion}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-luxury-champagne/25 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Capacidad
          </p>
          <p className="mt-2 text-2xl font-semibold text-luxury-black">
            {amenity.capacidad}
          </p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/25 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Reservación
          </p>
          <p className="mt-2 text-lg font-semibold text-luxury-black">
            {amenity.requiereReservacion ? "Requerida" : "Opcional"}
          </p>
        </div>

        <div className="rounded-2xl bg-luxury-champagne/25 p-4">
          <p className="text-xs uppercase tracking-wide text-luxury-charcoal/60">
            Acceso
          </p>
          <p className="mt-2 text-lg font-semibold text-luxury-black">
            {amenity.accesoVip ? "VIP" : "General"}
          </p>
        </div>
      </div>
    </article>
  );
}