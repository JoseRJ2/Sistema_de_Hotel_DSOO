import type { CleaningTimelineItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface CleaningStatusCardProps {
  items: CleaningTimelineItem[];
}

export default function CleaningStatusCard({
  items,
}: CleaningStatusCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Estado del servicio
      </h3>
      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Seguimiento del ciclo de higiene de la unidad.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  item.completed || item.current
                    ? "border-luxury-gold bg-luxury-gold"
                    : "border-luxury-gold/30 bg-white"
                }`}
              />
              {index < items.length - 1 ? (
                <div className="mt-2 h-full min-h-10 w-px bg-luxury-gold/30" />
              ) : null}
            </div>

            <div className="pb-4">
              <p className="font-semibold text-luxury-black">{item.title}</p>
              <p className="mt-1 text-sm text-luxury-charcoal/75">
                {item.description}
              </p>
              {item.current ? (
                <span className="mt-2 inline-flex rounded-full bg-luxury-black px-3 py-1 text-xs font-semibold text-luxury-ivory">
                  Estado actual
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}