"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  console.error("Error en higiene-alojamiento:", error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-luxury-ivory px-6 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">
          Gestión hotelera
        </p>

        <h1 className="mt-3 font-serif text-4xl text-luxury-black">
          Ocurrió un problema al cargar el módulo
        </h1>

        <p className="mt-4 text-sm leading-6 text-luxury-charcoal/80">
          Se presentó un error inesperado en la vista de ciclo de higiene y
          privacidad de alojamiento. Puedes intentar cargar nuevamente.
        </p>

        <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/25 p-4">
          <p className="text-sm font-medium text-luxury-black">
            Detalle técnico
          </p>
          <p className="mt-2 break-words text-sm text-luxury-charcoal/75">
            {error.message || "No fue posible obtener más información del error."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-luxury-black px-5 py-3 font-semibold text-luxury-ivory transition hover:opacity-90"
          >
            Reintentar
          </button>

          <a
            href="/higiene-alojamiento"
            className="rounded-xl border border-luxury-gold/40 bg-white px-5 py-3 font-semibold text-luxury-black transition hover:bg-luxury-champagne/40"
          >
            Volver al módulo
          </a>
        </div>
      </div>
    </main>
  );
}