import Link from "next/link";
import { AlertTriangle, ImageOff } from "lucide-react";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";

const DAYS_AHEAD = 3;
const DRAFT_STALE_DAYS = 7;

interface Reminder {
  id: string;
  icon: typeof ImageOff;
  text: string;
  href: string;
}

function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

// avisos de cosas que se pueden quedar olvidadas (evento sin foto, borrador viejo), calculado con lo que ya cargó el Dashboard
export function RemindersCard({ events, news }: { events: AdminEvent[]; news: AdminNews[] }) {
  const todayISO = new Date().toISOString().slice(0, 10);

  const reminders: Reminder[] = [];

  for (const event of events) {
    if (event.status === "archived") continue;
    const daysUntil = daysBetween(todayISO, event.startDate);
    if (daysUntil >= 0 && daysUntil <= DAYS_AHEAD && !event.imageSrc) {
      reminders.push({
        id: `event-photo-${event.id}`,
        icon: ImageOff,
        text: `"${event.title}" es en ${daysUntil === 0 ? "hoy" : daysUntil === 1 ? "1 día" : `${daysUntil} días`} y todavía no tiene foto`,
        href: `/admin/contenido/${event.id}/editar?type=event`,
      });
    }
  }

  const staleDrafts = [
    ...events.filter((event) => event.status === "draft").map((event) => ({ ...event, type: "event" as const })),
    ...news.filter((article) => article.status === "draft").map((article) => ({ ...article, type: "news" as const })),
  ].filter((item) => daysBetween(item.updatedAt.slice(0, 10), todayISO) >= DRAFT_STALE_DAYS);

  for (const draft of staleDrafts) {
    reminders.push({
      id: `draft-${draft.id}`,
      icon: AlertTriangle,
      text: `"${draft.title}" sigue en borrador desde hace más de una semana`,
      href: `/admin/contenido/${draft.id}/editar?type=${draft.type}`,
    });
  }

  if (reminders.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h3 className="font-heading text-sm font-bold text-amber-900">Para no olvidar</h3>
      <ul className="mt-3 space-y-2">
        {reminders.slice(0, 5).map((reminder) => (
          <li key={reminder.id}>
            <Link
              href={reminder.href}
              className="flex items-start gap-2.5 text-sm text-amber-800 transition-colors hover:text-amber-950"
            >
              <reminder.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {reminder.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
