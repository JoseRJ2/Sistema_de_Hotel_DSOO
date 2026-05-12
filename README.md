## Getting Started
npm install

npm run dev

docker compose up -d

## Variables de entorno para Google Calendar (recordatorios)
Agrega estas variables en tu archivo `.env` para habilitar el boton de "Agregar recordatorio a Google Calendar" en amenidades:

```env
GOOGLE_CALENDAR_ID=tu_calendar_id@group.calendar.google.com
GOOGLE_CALENDAR_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_TIMEZONE=America/Mexico_City
GOOGLE_CALENDAR_ALLOW_ATTENDEE_INVITES=false
```

Notas:
- La cuenta de servicio debe tener permiso para crear eventos en el calendario definido en `GOOGLE_CALENDAR_ID`.
- La `GOOGLE_CALENDAR_PRIVATE_KEY` debe conservar los `\n` en una sola linea tal como se muestra arriba.
- `GOOGLE_CALENDAR_ALLOW_ATTENDEE_INVITES` debe permanecer en `false` para cuentas personales; usar `true` requiere Domain-Wide Delegation en Google Workspace.


##Creedenciales de la cuenta Admin

Correo: admin@elrefugio.com

Contraseña: 12345678
