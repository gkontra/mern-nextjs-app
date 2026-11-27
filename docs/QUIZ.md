# QUIZ — Spezifikation (Erweiterung zum PRD)

Ergänzt `docs/PRD.md` (das PRD bleibt unverändert). Ersetzt die Nerdshop-Demo. Entscheidungen
des Trainers vom 2026-11-16.

## Ziel

Teilnehmende üben die Inhalte der 7 Module mit Multiple-Choice-Tests. Sie stellen einen
Test selbst zusammen (Kategorien, Anzahl Fragen, Zeitlimit), beantworten ihn unter Zeitdruck
und bekommen eine Auswertung mit Begründung zu jeder Antwort. Ergebnisse werden pro Nutzer
gespeichert.

## Rollen und Orte

| Wer               | Was                                                          | Wo                                   |
| ----------------- | ------------------------------------------------------------ | ------------------------------------ |
| Teilnehmende      | Test zusammenstellen, beantworten, Auswertung, Verlauf       | MERN-App (`frontend/` → Express-API) |
| Trainer           | Kategorien, Fragen, Antworten, Erklärungen pflegen           | Next.js-Admin (Phase 2), Server Actions |
| bis Phase 2       | Startbestand an Kategorien und Fragen                        | Seed-Skript (`backend/`)             |

Didaktischer Kontrast: Dieselben Collections werden im MERN-Teil über REST gelesen und im
Next.js-Admin per Server Components / Server Actions gepflegt.

## Datenmodell (MongoDB)

**`categories`**
- `name` (String, eindeutig), `slug` (String, eindeutig), `description` (String)
- `moduleId` (Number 1–7, optional) — Verknüpfung mit den Kursmodulen
- Seed: je Modul eine Kategorie; weitere Kategorien legt der Trainer an.

**`questions`**
- `categoryId` (ObjectId → categories), `text` (String), `code` (String, optional — Codeblock
  zur Frage, reiner Text)
- `answers`: Array mit 2–6 Einträgen `{ _id, text, isCorrect: Boolean, explanation: String }`
  — `explanation` erklärt, **warum diese Antwort richtig bzw. falsch** ist (optional pro
  Antwort, wird vom Trainer im Admin gepflegt)
- `successMessage` (String) — Rückmeldung, wenn die Frage **richtig** beantwortet wurde
- `errorMessage` (String) — Rückmeldung, wenn die Frage **falsch** oder unbeantwortet ist
- `note` (String, optional) — Zusatzhinweis, immer in der Auswertung sichtbar
  („Zur Info“, „Merke“, „Fiese Frage“)
- mindestens eine Antwort `isCorrect: true`; **eine oder mehrere** richtige Antworten erlaubt
- `status`: `'draft' | 'published'` — nur `published` wird gezogen
- `seedKey` (String, eindeutig, `sparse`) — Schlüssel aus `seed-data/quiz.json`; daran erkennt der
  Import „schon da“. Fragen aus dem Admin haben keinen.
- abgeleitet, **nicht gespeichert und nie vor der Abgabe ausgeliefert**: Anzahl richtiger Antworten.
- Antwort-Statistik wird nicht gespeichert, sondern aus `attempts` berechnet.

**`attempts`** (ein Testdurchlauf)
- `userId` (ObjectId → users), `categoryIds` (ObjectId[]), `questionCount` (Number),
  `timeLimitSec` (Number), `startedAt`, `submittedAt` (Date | null), `timedOut` (Boolean)
- `items`: `{ questionId, selectedAnswerIds: ObjectId[], isCorrect: Boolean | null }`
- `result`: `{ correct, wrong, unanswered, total }` (gesetzt bei Abgabe)

**`users`** (aus Meilenstein 2/3): `role: 'participant' | 'trainer'` vorsehen; die
MERN-App nutzt nur `participant`.

## Ablauf

1. **Test zusammenstellen** (`/quiz`, geschützt): Kategorien wählen (Mehrfachauswahl, mit
   Anzahl verfügbarer Fragen), Anzahl Fragen (≤ verfügbare), Zeitlimit (z. B. 5 / 10 / 15 /
   20 min). Start → `POST /api/attempts`.
2. **Server zieht** zufällig `questionCount` veröffentlichte Fragen aus den Kategorien,
   speichert den Attempt und liefert die Fragen **ohne** `isCorrect` und **ohne**
   `explanation` aus, dazu `startedAt` und `timeLimitSec`.
3. **Beantworten** (`/quiz/:attemptId`): eine Frage pro Ansicht oder Liste (UI-Entscheidung
   im Plan); **jede Frage mit Checkboxen** und demselben Hinweis „Wähle alle richtigen
   Antworten aus.“ — auch wenn nur eine Antwort richtig ist (siehe „Änderung 2026-11-23“).
   Countdown sichtbar und für Screenreader
   zugänglich (nicht sekündlich vorlesen; Warnungen z. B. bei 1 min). Navigation zwischen
   Fragen, Antworten änderbar bis zur Abgabe.
4. **Abgabe** manuell oder automatisch bei Zeitablauf → `POST /api/attempts/:id/submit`.
5. **Server wertet aus**: Eine Frage ist **richtig**, wenn die gewählte Menge **genau** der
   Menge der richtigen Antworten entspricht; keine Auswahl = **unbeantwortet**; sonst
   **falsch**. Zeit wird serverseitig geprüft (`startedAt + timeLimitSec` + kleine Toleranz);
   nach Ablauf eingehende Antworten werden ignoriert, der Attempt gilt als `timedOut`.
6. **Auswertung** (`/quiz/:attemptId/result`): Anzahl richtig / falsch / unbeantwortet,
   Quote, benötigte Zeit; pro Frage: `successMessage` bzw. `errorMessage`, alle Antworten mit
   Markierung (gewählt / richtig) und — falls vorhanden — der `explanation` darunter, dazu
   `note`. Fehlt eine Message, steht ein neutraler Standardtext („Richtig.“ / „Leider nicht
   richtig – sieh dir die markierten Antworten an.“).
7. **Verlauf** (`/profile`): frühere Attempts mit Datum, Kategorien, Ergebnis, Link zur
   Auswertung.

### Änderung 2026-11-23: immer Checkboxen

Entscheidung des Trainers nach Smoke-Test B1. Vorher zeigte die UI Radio-Buttons bei einer und
Checkboxen bei mehreren richtigen Antworten; die API lieferte dafür `multiple`. Das verriet
schon vor der Abgabe einen Teil der Lösung: Bei einer Radio-Frage war klar, dass genau eine
Antwort stimmt, bei einer Checkbox-Frage, dass es mindestens zwei sind. Jetzt:

- Die API liefert **kein** `multiple` mehr (weder laufend noch abgegeben noch im Verlauf).
- Jede Frage hat Checkboxen und den Hinweis „Wähle alle richtigen Antworten aus.“
- Der Server nimmt bei jeder Frage mehrere Antworten an (keine 422 mehr „nur eine Antwort
  möglich“). Bewertet wird weiter über exakte Mengengleichheit: zwei Häkchen bei nur einer
  richtigen Antwort = falsch.

## API (Express, Meilenstein 3/5)

| Methode | Pfad                          | Zweck                                        |
| ------- | ----------------------------- | -------------------------------------------- |
| GET     | `/api/categories`             | Kategorien + Anzahl veröffentlichter Fragen  |
| POST    | `/api/attempts`               | Test starten (Body: categoryIds, questionCount, timeLimitSec) |
| GET     | `/api/attempts/:id`           | laufender Test (ohne Lösungen) oder Ergebnis |
| PUT     | `/api/attempts/:id/answers`   | Zwischenstand speichern (optional)           |
| POST    | `/api/attempts/:id/submit`    | abgeben, auswerten                           |
| GET     | `/api/attempts?mine=true`     | eigener Verlauf                              |

Alle Attempt-Routen nur für den eingeloggten Besitzer (401/403/404 sauber unterscheiden).
Validierung mit klaren 422-Fehlern (z. B. mehr Fragen angefordert als vorhanden).

## Sicherheits- und Lernpunkte (gehören in die Trainer-Notizen)

- Lösungen und Erklärungen verlassen den Server erst nach der Abgabe — sonst stehen sie im
  Network-Tab.
- Zeitlimit und Bewertung entscheidet der Server, nicht der Countdown im Browser.
- Zufallsauswahl serverseitig (`$sample` in einer Aggregation).

## Startbestand: `backend/seed-data/quiz.json` (Import mit `npm run import`)

Entscheidung des Trainers (2026-11-25): Die Altfragen aus `MATERIAL/data/questions.json` werden
**nicht** verwendet — sie sind urheberrechtlich geschützt. Stattdessen eigene, für den Kurs
geschriebene Fragen im Zielformat (wie `seed-data/modules.json`), mit Erklärungen und Rückmeldungen.

| Kategorie (`slug`) | Name | `moduleId` | published | draft |
| --- | --- | ---: | ---: | ---: |
| `javascript-basics-1` | JavaScript-Grundlagen – Teil 1 | 1 | 6 | 0 |
| `javascript-basics-2` | JavaScript-Grundlagen – Teil 2 | 2 | 6 | 0 |
| `javascript-async` | Asynchrones JavaScript | 3 | 6 | 0 |
| `browser-apis` | Browser-APIs | 4 | 6 | 0 |
| `debugging-testing` | Debugging und Testing | 5 | 6 | 0 |
| `typescript` | TypeScript | 6 | 6 | 0 |
| `react` | React | 7 | 6 | 0 |
| `backend-node-express` | Backend mit Node.js und Express | – | 6 | 0 |
| `nextjs` | Next.js | – | 0 | 2 |

Aufbau: `{ categories: [{ slug, name, moduleId, description, questions: [{ seedKey, status, text,
code?, answers: [{ text, isCorrect, explanation }], successMessage, errorMessage, note? }] }] }`.

Regeln für das Import-Skript (`backend/scripts/import-questions.js`, idempotent):
- Vor der Verbindung prüfen: doppelte `slug` oder `seedKey` → Abbruch, nichts wird geschrieben.
- Kategorien per `insertOnly` mit Schlüssel `slug`, Fragen mit Schlüssel `seedKey`. Vorhandenes
  wird nie überschrieben — Änderungen an bestehenden Fragen passieren im Admin.
- HTML-Felder (`text`, `answers[].text`, `note`) mit der Allowlist säubern (`code`, `pre`,
  `strong`, `em`, `br`); `code`, `explanation`, `successMessage`, `errorMessage` sind Klartext.
  Die Datei selbst ist sauber (Test `test/quizSeed.test.js`); der Sanitizer ist das Sicherheitsnetz.
- Next.js hat nur Entwürfe → im Quiz eine **leere Kategorie** (für die 422-Prüfung „enthält noch
  keine Fragen“); freigegeben wird im Admin (Meilenstein 6).
- Neue Fragen schreibt der Kurs selbst — keine Fragen aus Büchern, Kursen oder fremden Quiz-Apps.
