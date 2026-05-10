import type { NotificationItem } from "@/types/higiene-alojamiento/higiene-alojamiento.types";

interface NotificationListProps {
  notifications: NotificationItem[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  if (!notifications.length) {
    return (
      <div className="rounded-2xl border border-dashed border-luxury-gold/30 bg-luxury-champagne/20 p-5 text-sm text-luxury-charcoal/75">
        No hay notificaciones por mostrar en este momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <article
          key={notification.id}
          className="rounded-2xl border border-luxury-gold/20 bg-luxury-ivory p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-luxury-black">
                {notification.title}
              </h4>
              <p className="mt-1 text-sm text-luxury-charcoal/75">
                {notification.description}
              </p>
            </div>

            <span className="shrink-0 text-xs font-medium text-luxury-charcoal/55">
              {notification.timestamp}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}