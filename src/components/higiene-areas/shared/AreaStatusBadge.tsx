import type { EstadoArea } from "@/types/higiene-areas/higiene-areas.types";

interface AreaStatusBadgeProps {
  status: EstadoArea;
}

const statusMap: Record<EstadoArea, { label: string; className: string }> = {
  DISPONIBLE: {
    label: "Disponible",
    className: "bg-luxury-champagne text-luxury-black border-luxury-gold/40",
  },
  LIMPIA: {
    label: "Limpia",
    className: "bg-luxury-gold/20 text-luxury-black border-luxury-gold",
  },
  EN_MANTENIMIENTO: {
    label: "En mantenimiento",
    className: "bg-luxury-charcoal text-luxury-ivory border-luxury-charcoal",
  },
  LIMPIEZA_PROFUNDA: {
    label: "Limpieza profunda",
    className: "bg-luxury-black text-luxury-ivory border-luxury-black",
  },
  BLOQUEADA: {
    label: "Bloqueada",
    className: "bg-white text-red-700 border-red-300",
  },
  INCIDENCIA: {
    label: "Incidencia",
    className: "bg-white text-amber-800 border-amber-300",
  },
};

export default function AreaStatusBadge({ status }: AreaStatusBadgeProps) {
  const config = statusMap[status];

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}