interface AmenityStatusBadgeProps {
  status: string;
}

export default function AmenityStatusBadge({
  status,
}: AmenityStatusBadgeProps) {
  const styles: Record<string, string> = {
    DISPONIBLE:
      "border-emerald-200 bg-emerald-50 text-emerald-800",

    OCUPADA:
      "border-amber-200 bg-amber-50 text-amber-800",

    MANTENIMIENTO:
      "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <span
      className={`rounded-full border px-4 py-2 text-sm font-medium ${
        styles[status] ??
        "border-luxury-gold/30 bg-luxury-champagne/30 text-luxury-black"
      }`}
    >
      {status}
    </span>
  );
}