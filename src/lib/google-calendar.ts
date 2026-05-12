import "server-only";
import { google } from "googleapis";

const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
];

interface GoogleCalendarConfig {
  calendarId: string;
  clientEmail: string;
  privateKey: string;
  timezone: string;
}

export interface CreateGoogleCalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime: string;
  attendeeEmail?: string;
}

export interface GoogleCalendarEventResult {
  id: string;
  htmlLink: string;
}

export class GoogleCalendarConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleCalendarConfigError";
  }
}

function getGoogleCalendarConfig(): GoogleCalendarConfig {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_CALENDAR_PRIVATE_KEY;
  const timezone =
    process.env.GOOGLE_CALENDAR_TIMEZONE ?? "America/Mexico_City";

  if (!calendarId || !clientEmail || !privateKeyRaw) {
    throw new GoogleCalendarConfigError(
      "Faltan variables de entorno para Google Calendar."
    );
  }

  return {
    calendarId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
    timezone,
  };
}

export async function createGoogleCalendarEvent(
  input: CreateGoogleCalendarEventInput
): Promise<GoogleCalendarEventResult> {
  const config = getGoogleCalendarConfig();
  const allowAttendeeInvites =
    process.env.GOOGLE_CALENDAR_ALLOW_ATTENDEE_INVITES === "true";
  const shouldAttachAttendees =
    allowAttendeeInvites && Boolean(input.attendeeEmail);

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: GOOGLE_CALENDAR_SCOPES,
  });

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const response = await calendar.events.insert({
    calendarId: config.calendarId,
    sendUpdates: shouldAttachAttendees ? "all" : "none",
    requestBody: {
      summary: input.summary,
      description: input.description,
      location: input.location,
      start: {
        dateTime: `${input.startDate}T${input.startTime}`,
        timeZone: config.timezone,
      },
      end: {
        dateTime: `${input.endDate ?? input.startDate}T${input.endTime}`,
        timeZone: config.timezone,
      },
      attendees: shouldAttachAttendees
        ? [{ email: input.attendeeEmail }]
        : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 180 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  return {
    id: response.data.id ?? "",
    htmlLink: response.data.htmlLink ?? "",
  };
}
