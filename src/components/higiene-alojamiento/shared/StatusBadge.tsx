import type { EstadoHigiene } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface StatusBadgeProps {
  status: EstadoHigiene;
}

const statusMap: Record<
  EstadoHigiene,
  { label: string; className: string }
> = {
  DISPONIBLE: {
    label: "Disponible",
    className: "bg-luxury-champagne text-luxury-black border border-luxury-gold/40",
  },
  SOLICITUD_RECIBIDA: {
    label: "Solicitud recibida",
    className: "bg-white text-luxury-black border border-luxury-gold/40",
  },
  NO_MOLESTAR: {
    label: "No molestar",
    className: "bg-luxury-black text-luxury-ivory border border-luxury-black",
  },
  PROGRAMADA: {
    label: "Programada",
    className: "bg-luxury-gold/15 text-luxury-black border border-luxury-gold/40",
  },
  EN_ESPERA: {
    label: "En espera",
    className: "bg-white text-luxury-charcoal border border-luxury-charcoal/20",
  },
  EN_LIMPIEZA: {
    label: "En limpieza",
    className: "bg-luxury-charcoal text-luxury-ivory border border-luxury-charcoal",
  },
  REPOSICION_INSUMOS: {
    label: "Reposición de insumos",
    className: "bg-luxury-champagne text-luxury-black border border-luxury-gold/40",
  },
  LIMPIA: {
    label: "Limpia",
    className: "bg-luxury-gold/20 text-luxury-black border border-luxury-gold",
  },
  CANCELADA: {
    label: "Cancelada",
    className: "bg-white text-red-700 border border-red-300",
  },
  SUCIA: {
    label: "Sucia",
    className: "bg-white text-amber-800 border border-amber-300",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}