interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="font-serif text-4xl text-luxury-black">
        {title}
      </h2>

      <p className="max-w-2xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
        {subtitle}
      </p>
    </div>
  );
}