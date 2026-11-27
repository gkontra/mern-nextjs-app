# PRD: Didaktisches WebDev-Projekt (MERN Stack vs. Next.js)

## 1. Projektübersicht & Didaktisches Ziel
Dieses Projekt dient als interaktives Lehrmaterial für angehende Webentwickler. Es demonstriert den evolutionären und architektonischen Unterschied zwischen klassischen, entkoppelten Single Page Applications (SPA) und modernen Full-Stack-Frameworks.

Die Architektur ist in zwei aufeinander aufbauende Phasen unterteilt, die auf dieselbe Datenbank zugreifen:
- **Phase 1 (Das Fundament):** Eine MERN-Stack-Anwendung (Vite/React + Node.js/Express). Hier lernen die Teilnehmer die harte Realität der klassischen Web-Infrastruktur kennen: CORS-Probleme, sauberes REST-API-Design, HTTP-Statuscodes und asynchrone Fetch-Logik im Client.
- **Phase 2 (Die Enterprise-Effizienz):** Ein Next.js-basiertes Admin-Dashboard. Hier entsteht das "Aha!"-Erlebnis: Durch Server Components und Server Actions fällt der gesamte API-Overhead weg. Die Entwicklungsgeschwindigkeit steigt drastisch, da Frontend und Backend in einer Codebase verschmelzen.

## 2. Systemarchitektur & Repository-Struktur
Das Projekt soll als Monorepo (z. B. via npm workspaces oder Turborepo) aufgesetzt werden, um alle Teile logisch zu bündeln:
- `/apps/backend-api` (Node.js / Express Server)
- `/apps/frontend-mern` (Vite / React App - Die öffentliche Kurs-Website)
- `/apps/admin-dashboard` (Next.js App Router - Das interne Dashboard)
- `/packages/db` (Optional: Geteilte Mongoose-Schemas und DB-Logik)

## 3. Datenmodell & Datenbank (MongoDB)
Beide Frontends kommunizieren mit derselben MongoDB-Datenbank.
**Collection:** `modules`
**Schema-Anforderungen:**
- `moduleId`: Number (1 bis 7)
- `title`: String (z. B. "Modul 1: HTML/CSS", "Modul 7: React")
- `description`: String
- `status`: Enum ('draft', 'published')
- `imageKey`: String (Referenz auf UI-Illustrationen)

*Aufgabe für die KI:* Erstelle ein Seed-Skript, das initiale Mock-Daten für genau 7 Module eines modernen Web-Development-Kurses generiert.

## 4. Phase 1: Die MERN-Website (Public App)
**Tech-Stack:** React, TypeScript, Vite, Node.js, Express, Mongoose, CSS/Sass oder Tailwind.
**Spezifikationen:**
- **UI:** Eine saubere, responsive Grid-Ansicht, die 7 Modul-Karten darstellt (Karten-Design mit Titel, Bild und Beschreibung).
- **Backend-Zwang:** Das Frontend darf **nicht** direkt mit der Datenbank sprechen. Alle Daten müssen über `fetch` oder `axios` von `/apps/backend-api` geladen werden.
- **CORS:** Das Express-Backend muss explizit so konfiguriert werden, dass es nur Requests vom lokalen Vite-Dev-Server akzeptiert, um das Konzept von Cross-Origin Resource Sharing greifbar zu machen.
- **State-Handling:** Ladezustände (Loading Spinner) und Fehlerbehandlung müssen im Client manuell über React-States verwaltet werden.

## 5. Phase 2: Das Next.js Admin-Dashboard
**Tech-Stack:** Next.js 15+ (App Router), TypeScript, Mongoose, Tailwind CSS.
**Spezifikationen:**
- **UI:** Ein einfaches Dashboard in Tabellen- oder Listenform, um die 7 Module zu verwalten (z. B. den Status von 'draft' auf 'published' setzen).
- **Architektonische Regel (WICHTIG):** Es dürfen **keine** REST-API-Routen (`app/api/`) erstellt werden.
- **Daten-Fetch:** Das Lesen der Module muss serverseitig direkt in asynchronen **React Server Components** über den Mongoose-Treiber erfolgen.
- **Daten-Mutation:** Das Aktualisieren der Daten muss ausschließlich über **Server Actions** stattfinden. Der Code muss radikal simplifiziert sein und auf Client-seitige `fetch`-Calls zum Speichern komplett verzichten.

## 6. Ausführungsanweisungen für Claude
Bitte setze dieses Projekt Schritt für Schritt um. Gehe wie folgt vor und warte auf meine Bestätigung nach jedem Meilenstein:
1. **Initialisierung:** Setup des Monorepos und der geteilten MongoDB-Verbindung inkl. Seed-Skript für die 7 Module.
2. **Backend & MERN:** Erstellung der Express-API und der Vite-App mit Fokus auf sauberes Fetching und CORS.
3. **Next.js Dashboard:** Implementierung der Full-Stack-App mit Server Components und Server Actions.
4. **Dokumentation:** Schreibe eine `README.md`, die diesen architektonischen Kontrast für Schulungszwecke prägnant zusammenfasst.