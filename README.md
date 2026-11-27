# PollApp

Umfrage-App (Angular 21 + Supabase): Umfragen erstellen, abstimmen und die Auswertung live verfolgen.

## Starten

```bash
cd PollApp
npm install
npx ng serve
```

Danach `http://localhost:4200/` öffnen.

## Auf den Server hochladen (FTP)

```bash
cd PollApp
npx ng build
```

Danach den **Inhalt** von `PollApp/dist/PollApp/browser/` per FTP (z. B. FileZilla) in einen beliebigen Ordner auf dem Server laden. Die App nutzt Hash-URLs (`…/#/survey/3`) und relative Pfade, deshalb läuft sie in jedem Ordner und braucht keine `.htaccess`.

## Datenbank (Supabase)

Für ein neues Supabase-Projekt einmal [`PollApp/supabase/schema.sql`](PollApp/supabase/schema.sql) im SQL Editor ausführen. Das Skript legt die Tabellen, die Zugriffsregeln (RLS), Realtime und Demo-Daten an (laufende und abgelaufene Umfragen). Die Projekt-URL und den Publishable Key trägst du in `PollApp/src/environments/environment.ts` ein.

## Extras (über die Checkliste hinaus)

- **Live-Auswertung über alle Geräte**: Neue Umfragen und Stimmen kommen per Supabase Realtime sofort bei allen offenen Browsern an.
- **Eine Stimme pro Browser**: Nach „Complete“ ist die Umfrage in diesem Browser gesperrt.
- **Schutz in der Datenbank**: Für abgelaufene Umfragen lehnt die Datenbank Stimmen ab (RLS), auch wenn jemand die API direkt aufruft. Bestehende Umfragen lassen sich nicht ändern oder löschen.
- **Deadline-Labels**: „Ends today“, „Ends in 1 Day“, „Ends in 3 Days“, bei vergangenen Umfragen „Ended on TT.MM.JJJJ“.
- **Responsive von 320 px bis Widescreen**: iPhone SE bis iPad und große Monitore; auf Tablets lassen sich die „Ending soon“-Karten seitlich scrollen, die Hover-Animation läuft nur mit Maus (Figma-Notiz).
- **Mobile Auswertung als Akkordeon**: „See results“ / „Close results“.
- **Nach dem Veröffentlichen**: Bestätigungs-Toast, danach landet man direkt auf der neuen Umfrage.
- **Formular**: bis zu 6 Antworten pro Frage, beliebig viele Fragen, Einfach- oder Mehrfachauswahl; Frage 1 und die ersten zwei Antworten werden beim Löschen nur geleert. Das Enddatum kann nicht in der Vergangenheit liegen.
- **Tests**: `npx ng test --watch=false` prüft die Datums-Logik (abgelaufen, Labels, Sortierung).
