import { addDays, format, parseISO } from "date-fns";

export type CalEvent = {
  uid: string;
  title: string;
  details: string;
  date: string;
  rrule?: string;
  alarmDays?: number;
};

function ymd(isoDate: string) {
  return isoDate.slice(0, 10).replace(/-/g, "");
}

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function stampUtc() {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function googleCalendarUrl(ev: CalEvent) {
  const start = ymd(ev.date);
  const end = format(addDays(parseISO(ev.date.slice(0, 10)), 1), "yyyyMMdd");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${start}/${end}`,
    details: ev.details,
  });
  if (ev.rrule) {
    params.set(
      "recur",
      ev.rrule.startsWith("RRULE:") ? ev.rrule : `RRULE:${ev.rrule}`,
    );
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function toIcs(events: CalEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//72h//Plecak kryzysowy//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  const now = stampUtc();
  for (const ev of events) {
    const start = ymd(ev.date);
    const end = format(addDays(parseISO(ev.date.slice(0, 10)), 1), "yyyyMMdd");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${icsEscape(ev.title)}`,
      `DESCRIPTION:${icsEscape(ev.details)}`,
    );
    if (ev.rrule) lines.push(`RRULE:${ev.rrule}`);
    if (ev.alarmDays && ev.alarmDays > 0) {
      lines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${icsEscape(ev.title)}`,
        `TRIGGER:-P${ev.alarmDays}D`,
        "END:VALARM",
      );
    }
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR", "");
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, events: CalEvent[]) {
  const blob = new Blob([toIcs(events)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function reviewEvent(date: Date, everyMonths: number): CalEvent {
  const day = format(date, "yyyy-MM-dd");
  return {
    uid: `przeglad-72h-${day}@plecak-kryzysowy`,
    title: "Przegląd plecaka 72h",
    details:
      "Otwórz zestaw: leki, racje, woda, baterie, tabletki, plastry. Wymień, co padło. Oznacz przegląd w aplikacji.",
    date: day,
    rrule: `FREQ=MONTHLY;INTERVAL=${everyMonths}`,
    alarmDays: 7,
  };
}

export function expiryEvent(
  id: string,
  name: string,
  iso: string,
): CalEvent {
  const day = iso.slice(0, 10);
  return {
    uid: `waznosc-${id}-${day}@plecak-kryzysowy`,
    title: `Ważność: ${name}`,
    details: `Wymień w plecaku kryzysowym 72h. Po wymianie popraw datę w aplikacji.`,
    date: day,
    alarmDays: 14,
  };
}
