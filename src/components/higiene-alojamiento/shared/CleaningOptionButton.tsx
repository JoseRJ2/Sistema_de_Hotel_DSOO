interface CleaningOptionButtonProps {
  label: string;
  description: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export default function CleaningOptionButton({
  label,
  description,
  onClick,
  variant = "secondary",
}: CleaningOptionButtonProps) {
  const variantClasses = {
    primary:
      "border-luxury-gold bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90",
    secondary:
      "border-luxury-gold/40 bg-white text-luxury-black hover:bg-luxury-champagne/50",
    danger:
      "border-luxury-black bg-luxury-black text-luxury-ivory hover:opacity-90",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${variantClasses[variant]}`}
    >
      <div className="font-semibold">{label}</div>
      <div className="mt-1 text-sm opacity-80">{description}</div>
    </button>
  );
}