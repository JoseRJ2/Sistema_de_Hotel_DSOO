"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NotificationItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

const USUARIO_CLIENTE_ID = 1;

export default function NotificacionesDetallePage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/higiene-alojamiento/notificaciones/${USUARIO_CLIENTE_ID}`, { cache: "no-store" });
      if (!res.ok) return;
      const data: NotificationItem[] = await res.json();
      setNotifications(data);
    };

    void load();
  }, []);

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/dashboard-cliente" className="text-sm font-semibold text-luxury-gold">Volver al dashboard</Link>
        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl text-luxury-black">Mis notificaciones</h1>
          <p className="mt-2 text-luxury-charcoal/70">Historial completo de avisos de tu estancia.</p>
        </header>

        <section className="space-y-4">
          {notifications.map((notification) => (
            <article key={notification.id} className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-luxury-black">{notification.title}</h2>
              <p className="mt-2 text-luxury-charcoal/75">{notification.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-luxury-charcoal/55">{notification.timestamp}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
