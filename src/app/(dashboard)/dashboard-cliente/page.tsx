"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BedDouble,
  Bell,
  CalendarClock,
  ChevronRight,
  LogOut,
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
  const router = useRouter();
  const { usuario, cargando, logout, esCliente } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
            Cargando sesion del cliente...
          </div>
        </div>
      </main>
    );
  }

  if (!usuario || !esCliente || !usuario.id_cliente) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl text-luxury-black">
              Acceso restringido
            </h1>
            <p className="mt-2 text-luxury-charcoal/70">
              Inicia sesion como cliente para ver tu dashboard personalizado.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-xl bg-luxury-black px-5 py-2 text-sm font-semibold text-luxury-ivory"
            >
              Ir a iniciar sesion
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="py-4">
          <div className="mb-6 flex items-center justify-end">
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 rounded-xl border border-luxury-gold/35 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-luxury-black transition hover:bg-luxury-champagne/35"
            >
              <LogOut size={14} />
              Cerrar sesion
            </button>
          </div>

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
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-luxury-charcoal/55">
              Cliente: {usuario.nombre_completo}
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
