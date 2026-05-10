import NotificationList from "@/components/higiene-alojamiento/lists/NotificationList";
import type { NotificationItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface NotificationsCardProps {
  notifications: NotificationItem[];
}

export default function NotificationsCard({
  notifications,
}: NotificationsCardProps) {
  return (
    <article className="rounded-3xl border border-luxury-gold/25 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-2xl text-luxury-black">
        Notificaciones del servicio
      </h3>

      <p className="mt-2 text-sm text-luxury-charcoal/80">
        Consulta avisos relacionados con la programación, atención y finalización
        de la limpieza.
      </p>

      <div className="mt-5">
        <NotificationList notifications={notifications} />
      </div>
    </article>
  );
}