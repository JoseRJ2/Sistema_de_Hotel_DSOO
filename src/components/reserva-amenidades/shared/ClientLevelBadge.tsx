interface ClientLevelBadgeProps {
  level: string;
}

export default function ClientLevelBadge({
  level,
}: ClientLevelBadgeProps) {
  const styles: Record<string, string> = {
    VIP: "bg-purple-100 text-purple-900 border-purple-200",
    PREMIUM: "bg-amber-100 text-amber-900 border-amber-200",
    ESTANDAR: "bg-gray-100 text-gray-900 border-gray-200",
  };

  return (
    <span
      className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide ${
        styles[level] ??
        "bg-luxury-champagne/30 text-luxury-black border-luxury-gold/20"
      }`}
    >
      {level}
    </span>
  );
}