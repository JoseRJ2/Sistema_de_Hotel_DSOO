import AmenityStatusBadge from "../shared/AmenityStatusBadge";
import type { AmenityItem } from "@/types/reserva-amenidades/reserva-amenidades.types";

interface AmenityCatalogCardProps {
  amenity: AmenityItem;
  onSelect: (amenity: AmenityItem) => void;
}

export default function AmenityCatalogCard({
  amenity,
  onSelect,
}: AmenityCatalogCardProps) {
  return (
    <article className="rounded-[2rem] border border-luxury-gold/20 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
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

      <p className="mt-6 text-sm leading-6 text-luxury-charcoal/80">
        {amenity.descripcion}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-luxury-champagne/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-charcoal/60">
            Capacidad
          </p>

          <p className="mt-3 text-3xl font-semibold">
            {amenity.capacidad}
          </p>
        </div>

        <div className="rounded-3xl bg-luxury-champagne/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-charcoal/60">
            Acceso
          </p>

          <p className="mt-3 text-xl font-semibold">
            {amenity.accesoVip ? "VIP" : "General"}
          </p>
        </div>
      </div>

      <button
        onClick={() => onSelect(amenity)}
        className="mt-8 rounded-2xl bg-luxury-black px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Reservar amenidad
      </button>
    </article>
  );
}