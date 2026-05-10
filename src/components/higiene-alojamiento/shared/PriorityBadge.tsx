interface PriorityBadgeProps {
  priority: boolean;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) return null;

  return (
    <span className="inline-flex rounded-full border border-luxury-gold bg-luxury-gold/15 px-3 py-1 text-xs font-semibold text-luxury-black">
      Prioridad alta
    </span>
  );
}