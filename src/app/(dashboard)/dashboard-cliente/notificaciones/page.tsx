"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NotificationItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";
import { useDashboardClienteContext } from "@/hooks/useDashboardClienteContext";

export default function NotificacionesDetallePage() {
  const { usuario, usuarioId, loading: contextLoading, sessionReady } =
    useDashboardClienteContext();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!usuarioId) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const res = await fetch(`/api/higiene-alojamiento/notificaciones/${usuarioId}`, { cache: "no-store" });
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data: NotificationItem[] = await res.json();
      setNotifications(data);
      setIsLoading(false);
    };

    if (!contextLoading) {
      void load();
    }
  }, [usuarioId, contextLoading]);

  if (contextLoading) {
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

  if (!sessionReady || !usuario) {
    return (
      <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl text-luxury-black">
              Acceso restringido
            </h1>
            <p className="mt-2 text-luxury-charcoal/70">
              Inicia sesion como cliente para ver tus notificaciones.
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
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mis notificaciones</h1>
          <p className="mt-2 text-luxury-charcoal/70">Historial completo de avisos de tu estancia.</p>
        </header>

        <section className="space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-luxury-gold/20 bg-luxury-champagne/20 p-4 text-sm text-luxury-charcoal/80">
              Cargando notificaciones...
            </div>
          ) : null}

          {notifications.map((notification) => (
            <article key={notification.id} className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-luxury-black">{notification.title}</h2>
              <p className="mt-2 text-luxury-charcoal/75">{notification.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-luxury-charcoal/55">{notification.timestamp}</p>
            </article>
          ))}

          {!isLoading && notifications.length === 0 ? (
            <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 text-sm text-luxury-charcoal/75">
              No tienes notificaciones por ahora.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
