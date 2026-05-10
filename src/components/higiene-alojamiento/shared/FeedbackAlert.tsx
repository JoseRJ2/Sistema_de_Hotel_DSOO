interface FeedbackAlertProps {
  title: string;
  message: string;
  variant?: "success" | "info" | "warning";
}

export default function FeedbackAlert({
  title,
  message,
  variant = "info",
}: FeedbackAlertProps) {
  const variantClasses = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900",
    info:
      "border-luxury-gold/30 bg-luxury-champagne/35 text-luxury-black",
    warning:
      "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${variantClasses[variant]}`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-85">{message}</p>
    </div>
  );
}