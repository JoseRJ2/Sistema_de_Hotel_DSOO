interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-2xl text-luxury-black">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-luxury-charcoal/80">{subtitle}</p>
      ) : null}
    </div>
  );
}