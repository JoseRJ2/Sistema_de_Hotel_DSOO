import Link from "next/link";
import { ChevronRight, ClipboardList, Sparkles } from "lucide-react";

const hygieneModules = [
  {
    href: "/higiene-alojamiento",
    icon: Sparkles,
    badge: "Alojamiento",
    title: "Higiene de alojamiento",
    description:
      "Gestiona privacidad, solicitudes de limpieza y seguimiento operativo para habitaciones y villas.",
  },
  {
    href: "/higiene-areas",
    icon: ClipboardList,
    badge: "Areas comunes",
    title: "Higiene de areas",
    description:
      "Administra rondas, checklist y estado de higiene en SPA, gimnasio, piscina, lobby y otras areas.",
  },
];

export default function HigieneOperacionesPage() {
  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link href="/#admin" className="text-sm font-semibold text-luxury-gold">
          Volver al panel de administracion
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">
            Acceso interno
          </p>
          <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">
            Operaciones de higiene
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
            Selecciona el modulo que deseas administrar.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {hygieneModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group block rounded-3xl border border-luxury-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-luxury-gold/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-luxury-champagne/50 transition-colors group-hover:bg-luxury-gold/20">
                <module.icon
                  size={20}
                  className="text-luxury-charcoal/70 transition-colors group-hover:text-luxury-gold"
                />
              </div>

              <span className="mb-3 inline-block rounded-full bg-luxury-champagne/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-luxury-charcoal/60">
                {module.badge}
              </span>

              <h2 className="font-serif text-2xl text-luxury-black">{module.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-luxury-charcoal/70">
                {module.description}
              </p>

              <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-luxury-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Abrir modulo <ChevronRight size={14} />
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

