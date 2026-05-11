"use client";

import Link from "next/link";
import {
  BedDouble,
  Bell,
  CalendarClock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const dashboardCards = [
  {
    href: "/dashboard-cliente/estancia",
    icon: BedDouble,
    badge: "Estancia",
    title: "Mi estancia actual",
    desc: "Consulta detalles de check-in, check-out y estado de tu alojamiento.",
  },
  {
    href: "/dashboard-cliente/higiene",
    icon: ShieldCheck,
    badge: "Higiene",
    title: "Gestion de higiene",
    desc: "Programa limpieza, activa No molestar o ajusta tus preferencias.",
  },
  {
    href: "/dashboard-cliente/amenidades",
    icon: Sparkles,
    badge: "Amenidades",
    title: "Mis amenidades disponibles",
    desc: "Explora experiencias activas y entra al modulo de reservacion.",
  },
  {
    href: "/dashboard-cliente/reservas",
    icon: CalendarClock,
    badge: "Reservas",
    title: "Mis proximas reservas",
    desc: "Revisa confirmaciones, fechas y estado de tus reservaciones.",
  },
  {
    href: "/dashboard-cliente/notificaciones",
    icon: Bell,
    badge: "Avisos",
    title: "Mis notificaciones",
    desc: "Consulta mensajes y alertas importantes de tu estancia.",
  },
];

export default function DashboardClientePage() {
  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="py-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-luxury-charcoal/50 mb-3">
              Acceso cliente
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">
              Panel del Cliente
            </h1>
            <div className="w-16 h-px bg-luxury-gold mx-auto mb-6" />
            <p className="text-luxury-charcoal/70 max-w-2xl mx-auto">
              Selecciona una opcion para administrar tu estancia en el resort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block rounded-2xl border border-luxury-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-luxury-gold/40 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-luxury-champagne/50 mb-5 group-hover:bg-luxury-gold/20 transition-colors">
                  <card.icon
                    size={20}
                    className="text-luxury-charcoal/70 group-hover:text-luxury-gold transition-colors"
                  />
                </div>
                <span className="inline-block rounded-full bg-luxury-champagne/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-luxury-charcoal/60 mb-3">
                  {card.badge}
                </span>
                <h2 className="font-serif text-lg text-luxury-black mb-1">
                  {card.title}
                </h2>
                <p className="text-sm text-luxury-charcoal/60 leading-relaxed">
                  {card.desc}
                </p>
                <p className="mt-4 text-xs font-semibold text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  Acceder <ChevronRight size={14} />
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
