interface HygieneSealCardProps {
  visible: boolean;
}

export default function HygieneSealCard({ visible }: HygieneSealCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Sello de higiene
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Indicador visible para clientes dentro de la aplicación.
      </p>

      <div
        className={`mt-5 rounded-2xl border p-5 ${
          visible
            ? "border-luxury-gold bg-luxury-gold/15 text-luxury-black"
            : "border-luxury-charcoal/20 bg-luxury-champagne/25 text-luxury-charcoal"
        }`}
      >
        <p className="font-semibold">
          {visible ? "Área certificada como limpia" : "Sello temporalmente oculto"}
        </p>
        <p className="mt-1 text-sm opacity-80">
          {visible
            ? "El área puede mostrarse como disponible para clientes."
            : "El área requiere validación antes de mostrarse como limpia."}
        </p>
      </div>
    </article>
  );
}