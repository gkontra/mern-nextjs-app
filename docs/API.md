# API — Vertrag zwischen Frontend und Express-Backend

Diese Datei beschreibt, was das Express-Backend (`backend/`, ab Meilenstein 3) liefert, damit
das Frontend ohne Umbau läuft. Mit `VITE_USE_MOCK_API=true` läuft das Frontend ganz ohne
Server: `frontend/src/services/authService.mock.js` bedient den Auth-Vertrag,
`modulesService.mock.js` (mit der Fixture `modules.mock.json`) die Modul-Liste. Das Quiz
(`/attempts`) hat **keinen** Mock und braucht immer das Backend: Zeit und Bewertung entscheidet
der Server.

## Grundregeln

- Basis-URL im Dev: `http://localhost:3000/api`. Das Backend hängt alle Routen unter `/api`
  ein. Das Frontend ruft sie relativ zu `VITE_API_URL` auf
  (`VITE_API_URL=http://localhost:3000/api` in `frontend/.env`). Fehlt die Variable, fällt
  `services/api.js` auf den relativen Pfad `/api` zurück.
- Request- und Response-Bodys sind JSON (`Content-Type: application/json`). Requests mit
  Body, aber einem anderen `Content-Type`, enden mit `400 BAD_REQUEST`. Bodys über 10 kB
  ebenfalls.
- **Jede** Fehlerantwort hat das Fehlerformat unten, auch 404 und 500.
- Fehlermeldungen sind deutsch, damit der Client sie direkt anzeigen kann.
- Codes und Standardtexte der Fehler stehen einmal in `shared/src/errors/index.js`
  (`ERROR_CODE`, `ERROR_MESSAGES`); Backend und Mock lesen sie dort.
- Der Client schickt Cookies mit (`withCredentials: true` in `services/api.js`).

## Auth-Endpunkte

| Methode + Pfad        | Request-Body                | Erfolg                                     | Fehler                                    |
| --------------------- | --------------------------- | ------------------------------------------ | ----------------------------------------- |
| `POST /auth/register` | `{ name, email, password }` | `201 { user }` + setzt Cookie (Auto-Login) | 400, 409 `EMAIL_TAKEN`, 422               |
| `POST /auth/login`    | `{ email, password }`       | `200 { user }` + setzt Cookie              | 400, 401 `INVALID_CREDENTIALS`, 422       |
| `POST /auth/logout`   | —                           | `204`, löscht Cookie (`Max-Age=0`)         | — (auch ohne Login `204`)                 |
| `GET /auth/me`        | —                           | `200 { user }`                             | 401 `UNAUTHENTICATED`                     |

## Datenformen

**User**

```json
{ "id": "string", "name": "string", "email": "string", "role": "participant" }
```

- `role` ist `"participant"` oder `"trainer"` (siehe [`QUIZ.md`](QUIZ.md)).
- Die Registrierung legt immer `participant` an. Ein `role`-Feld im Request-Body wird
  ignoriert. Trainer-Konten entstehen nur über das Seed-Skript.
- Das Passwort (bzw. sein Hash) verlässt den Server nie.

**Fehler**

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Bitte prüfe deine Eingaben.",
    "fields": { "password": "Das Passwort muss 8 bis 72 Zeichen lang sein." }
  }
}
```

- `fields` gibt es nur bei 422. Die Schlüssel entsprechen den Feldnamen im Request.
- `code` ist für Programme, `message` für Menschen.

## Statuscodes

| Code | Bedeutung                                                                                   |
| ---- | ------------------------------------------------------------------------------------------- |
| 400  | `BAD_REQUEST` — Anfrage kaputt: kein JSON, Body fehlt, falsche Typen.                        |
| 401  | `INVALID_CREDENTIALS` beim Login — **eine** allgemeine Meldung, egal ob E-Mail oder Passwort falsch ist. `UNAUTHENTICATED` bei `/auth/me` und allen `/attempts`-Routen: Cookie fehlt, ungültig oder abgelaufen. |
| 403  | `FORBIDDEN` — angemeldet, aber der Test gehört einem anderen Konto.                          |
| 404  | `NOT_FOUND` — Route unbekannt („Diese Route gibt es nicht.“), Modul fehlt bzw. ist `draft`, oder den Test gibt es nicht. |
| 409  | `EMAIL_TAKEN` — E-Mail ist schon registriert. `ATTEMPT_RUNNING` — es läuft schon ein Test. `ATTEMPT_CLOSED` — der Test ist schon abgegeben. |
| 422  | `VALIDATION_FAILED` — Anfrage formal korrekt, verletzt aber eine Regel (siehe unten).        |
| 500  | `INTERNAL_ERROR` — ohne Details. Die Ursache steht nur im Server-Log.                        |

Validierungsregeln (Server, maßgeblich). Grenzen, Texte und Prüfungen stehen in
`shared/src/auth/` (`validateRegistration`, `validateLogin`); Formular, Backend und Mock rufen
dieselben Funktionen auf:

- `name`: 2–50 Zeichen nach `trim()` — „Der Name muss 2 bis 50 Zeichen lang sein.“
- `email`: nicht leer („Bitte gib deine E-Mail-Adresse ein.“), gültiges Format („Bitte gib eine
  gültige E-Mail-Adresse ein, z. B. name@example.com.“), wird kleingeschrieben gespeichert.
- `password` bei der Registrierung, in dieser Reihenfolge: nicht leer („Bitte gib dein Passwort
  ein.“); 8–72 Zeichen **und** höchstens 72 Bytes in UTF-8 (72 Bytes = Grenze von bcrypt; `ä`
  zählt 2 Bytes, ein Emoji 4) — beide Verstöße melden „Das Passwort muss 8 bis 72 Zeichen lang
  sein.“; nicht auf einer kurzen Sperrliste (z. B. `passwort`) — „Dieses Passwort ist zu leicht zu
  erraten.“ Die Sperrliste steht in `shared/src/auth/limits.js`; der Client prüft sie mit, der
  Server prüft trotzdem jede Anfrage selbst. Was nur der Server wissen kann, bleibt dort:
  `409 EMAIL_TAKEN` und die Kategorie-Prüfung beim Quiz-Start.
- `password` beim Login: nur nicht leer. Alles andere ergibt `401 INVALID_CREDENTIALS`.

Nur im Dev (`NODE_ENV` ≠ `production`): Login oder Registrierung mit
`server-fehler@example.com` löst absichtlich `500 INTERNAL_ERROR` aus — zum Testen der
Fehleranzeige. In Produktion ist das eine normale (unbekannte) Adresse.

## Cookie

- Name `auth_token`, Inhalt: JWT `{ sub, role }`, gültig 1 Tag.
- Attribute: `HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`, in Produktion zusätzlich
  `Secure`.
- `localhost:5173` und `localhost:3000` gelten als dieselbe **Site** — der Browser schickt
  das Cookie im Dev mit, obwohl es zwei verschiedene **Origins** sind.
- Kein Token im `localStorage`, kein Token im Response-Body.
- CSRF-Schutz: `SameSite=Lax` plus „nur JSON-Bodys annehmen“. CORS allein verhindert nicht,
  dass ein einfacher Request (z. B. `POST` mit `text/plain`) beim Server ankommt.

## CORS

Frontend (`http://localhost:5173`) und API (`http://localhost:3000`) sind zwei Origins. Das
Backend erlaubt genau eine davon, mit Cookies:

```js
app.use(cors({ origin: config.clientOrigin, credentials: true }));
```

- `CLIENT_ORIGIN` in `backend/.env` ist die **eine** erlaubte Origin, exakt
  (`http://localhost:5173`, ohne Pfad). Kein `*`: Mit Credentials lehnt der Browser die
  Wildcard ab. Auch kein Spiegeln der anfragenden Origin.
- `cors` steht in `app.js` **vor** `express.json`, `cookieParser` und den Routen. Nur so
  bekommen alle Antworten die Header, und nur so beantwortet `cors` den Preflight.
- Jede Antwort trägt `Access-Control-Allow-Origin: <CLIENT_ORIGIN>`,
  `Access-Control-Allow-Credentials: true` und `Vary: Origin` — unabhängig davon, welche Origin
  anfragt. Vergleichen und blockieren tut der Browser.
- **Preflight:** Requests mit JSON-Body schickt der Browser erst nach einem `OPTIONS`. Antwort
  `204` mit `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE` und
  `Access-Control-Allow-Headers` = die angefragten Header (bei uns `content-type`).
- Kein `Access-Control-Max-Age`: Chrome behält einen Preflight dann etwa 5 Sekunden.
- `GET`-Requests ohne eigene Header (`/modules`, `/auth/me`) brauchen keinen Preflight.
- Der Client muss Cookies ausdrücklich mitschicken: `withCredentials: true` in
  `services/api.js`.

Die zugehörigen Experimente (E0–E8, mit den Chrome-Meldungen im Wortlaut) stehen in
`docs/TRAINER-NOTES.md` → Meilenstein 4, Teil B.

## Modul-Endpunkte

Öffentlich, ohne Login.

| Methode + Pfad           | Erfolg                                    | Fehler                               |
| ------------------------ | ----------------------------------------- | ------------------------------------ |
| `GET /modules`           | `200` Array aller `published`-Module, sortiert nach `moduleId` | —                |
| `GET /modules/:moduleId` | `200` ein Modul                            | 404 `NOT_FOUND` „Dieses Modul gibt es nicht.“ |

**Modul**

```json
{
  "moduleId": 3,
  "title": "JavaScript für Fortgeschrittene",
  "description": "Du arbeitest asynchron mit Promises und async/await und lädst Daten per Fetch.",
  "status": "published",
  "imageKey": "module-3-js-advanced",
  "tags": ["Promises", "async/await", "Fetch"]
}
```

- Dieselbe Form wie die Seed-Quelle `backend/seed-data/modules.json` und die Mock-Fixture
  `frontend/src/services/modules.mock.json`; kein `_id`, kein `__v`.
- `GET /modules` liefert ein **nacktes Array** (kein `{ modules: … }`). `modulesService.js`
  prüft, dass die Antwort ein Array ist („Die Antwort enthält keine Modulliste.“).
- `:moduleId` ist die Zahl 1–7, nicht die MongoDB-`_id`. `404` gilt, wenn das Modul fehlt,
  `draft` ist oder `:moduleId` keine ganze Zahl ist (`/modules/abc`).

## Kategorie-Endpunkte

Öffentlich, ohne Login.

| Methode + Pfad    | Erfolg                                  | Fehler |
| ----------------- | --------------------------------------- | ------ |
| `GET /categories` | `200` Array aller Kategorien            | —      |

**Kategorie**

```json
{
  "id": "6afcc6a50fc30a3685832e01",
  "name": "JavaScript-Grundlagen – Teil 1",
  "slug": "javascript-basics-part1",
  "description": "Fragen zu Variablen, Datentypen, Operatoren, Bedingungen, Schleifen und Funktionen.",
  "moduleId": 1,
  "questionCount": 88
}
```

- **Nacktes Array**, wie bei `/modules`.
- `id` ist die MongoDB-`_id` als String; `_id` und `__v` werden nicht ausgeliefert.
- `moduleId` ist 1–7 oder `null` (Kategorie ohne Kursmodul, z. B. Phaser).
- `questionCount` zählt nur Fragen mit `status: "published"`. Kategorien ohne
  veröffentlichte Fragen sind trotzdem enthalten (`questionCount: 0`), damit die
  Test-Auswahl in Meilenstein 5 sie deaktiviert anzeigen kann.
- Sortierung: nach `moduleId` aufsteigend, Kategorien ohne `moduleId` zuletzt, danach nach
  `name`.

## Quiz-Endpunkte (Testdurchläufe)

Alle Routen unter `/attempts` brauchen ein gültiges `auth_token`-Cookie. Ein Testdurchlauf (**Attempt**)
gehört genau einem Konto. Bewertung und Zeit entscheidet der Server. Fachliche Grundlage:
[`QUIZ.md`](QUIZ.md).

| Methode + Pfad                 | Request-Body                                       | Erfolg                       | Fehler                                        |
| ------------------------------ | -------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `POST /attempts`               | `{ categoryIds, questionCount, timeLimitSec }`     | `201` laufender Attempt      | 400, 401, 409 `ATTEMPT_RUNNING`, 422          |
| `GET /attempts?mine=true`      | —                                                  | `200` Array (Verlauf)        | 400, 401                                      |
| `GET /attempts/:id`            | —                                                  | `200` laufend oder abgegeben | 401, 403, 404                                 |
| `PUT /attempts/:id/answers`    | `{ answers: [{ questionId, selectedAnswerIds }] }` | `204`                        | 400, 401, 403, 404, 409 `ATTEMPT_CLOSED`, 422 |
| `POST /attempts/:id/submit`    | `{ answers: [{ questionId, selectedAnswerIds }] }` | `200` abgegebener Attempt    | 400, 401, 403, 404, 409 `ATTEMPT_CLOSED`, 422 |

### Reihenfolge der Prüfungen

1. **401** `UNAUTHENTICATED` — Cookie fehlt, ist ungültig oder abgelaufen. „Bitte melde dich an.“
2. **400** `BAD_REQUEST` — kein JSON, Body fehlt oder falsche Typen. „Die Anfrage ist ungültig.“
3. **404** `NOT_FOUND` — `:id` ist keine gültige ObjectId oder es gibt den Attempt nicht. „Diesen Test gibt es nicht.“
4. **403** `FORBIDDEN` — der Attempt gehört einem anderen Konto. „Dieser Test gehört zu einem anderen Konto.“
5. **409** — Zustandskonflikt (siehe unten).
6. **422** `VALIDATION_FAILED` — Regel verletzt, mit `fields`. „Bitte prüfe deine Eingaben.“

401 heißt „wer bist du?“, 403 „ich weiß, wer du bist, aber das gehört dir nicht“, 404 „gibt es nicht“.
Auch Trainer-Konten sehen nur ihre eigenen Attempts.

### Regeln für `POST /attempts`

| Feld            | Typ (sonst 400)                  | Regel (sonst 422)                                     | Meldung in `fields` |
| --------------- | -------------------------------- | ----------------------------------------------------- | ------------------- |
| `categoryIds`   | Array aus Strings, ≤ 20 Einträge | mind. ein Eintrag                                     | „Bitte wähle mindestens eine Kategorie.“ |
|                 |                                  | jede ID gültig und vorhanden                          | „Mindestens eine gewählte Kategorie gibt es nicht.“ |
|                 |                                  | jede Kategorie hat veröffentlichte Fragen             | „Die Kategorie „React“ enthält noch keine Fragen.“ (Name der ersten leeren Kategorie) |
| `questionCount` | ganze Zahl (Number)              | 1 bis 30                                              | „Die Anzahl der Fragen muss zwischen 1 und 30 liegen.“ |
|                 |                                  | ≤ veröffentlichte Fragen der gewählten Kategorien     | „In deiner Auswahl gibt es nur 12 Fragen.“ (bei einer: „nur 1 Frage.“) |
| `timeLimitSec`  | ganze Zahl (Number)              | genau `300`, `600`, `900` oder `1200`                 | „Bitte wähle 5, 10, 15 oder 20 Minuten.“ |

- Grenzen, Texte und `validateQuizSetup` stehen in `shared/src/quiz/`; der Zeitlimit-Text wird aus
  `TIME_LIMITS_SEC` erzeugt. Nur Typprüfung (400), ObjectId und Datenbank-Abgleich bleiben im Backend.
- Doppelte IDs in `categoryIds` zählen einmal.
- Der Server zieht `questionCount` **zufällig** aus den veröffentlichten Fragen der gewählten Kategorien und
  mischt die Antworten jeder Frage. Die Reihenfolge wird gespeichert und bleibt nach einem Reload gleich.
- Pro Konto gibt es höchstens **einen laufenden** Attempt. Läuft schon einer, antwortet der Server mit
  **409** `ATTEMPT_RUNNING`: „Du hast bereits einen laufenden Test. Setze ihn fort oder gib ihn ab.“
  Den laufenden Attempt findet der Client im Verlauf (`status: "running"`). Diese Prüfung kommt vor den
  422-Regeln.

### Laufender Attempt (`201` bei `POST`, `200` bei `GET` vor der Abgabe)

```json
{
  "id": "6b0f…",
  "status": "running",
  "categories": [{ "id": "6afc…", "name": "JavaScript im Browser (DOM)" }],
  "questionCount": 2,
  "timeLimitSec": 600,
  "startedAt": "2026-11-22T09:00:00.000Z",
  "deadline": "2026-11-22T09:10:00.000Z",
  "serverNow": "2026-11-22T09:00:00.120Z",
  "questions": [
    {
      "id": "6afd…",
      "text": "Was gibt <code>typeof null</code> zurück?",
      "code": "",
      "answers": [
        { "id": "6afd…a1", "text": "<code>\"object\"</code>" },
        { "id": "6afd…a2", "text": "<code>\"null\"</code>" }
      ],
      "selectedAnswerIds": []
    }
  ]
}
```

- **Nicht enthalten, bis abgegeben ist:** `isCorrect`, `explanation`, `successMessage`, `errorMessage`, `note`,
  `result`, die Anzahl richtiger Antworten. Sonst stünden die Lösungen im Network-Tab.
- Es gibt **kein** Feld `multiple`. Jede Frage wird mit Checkboxen beantwortet, auch wenn nur eine Antwort
  richtig ist. Der Client erfährt vor der Abgabe nicht, ob eine oder mehrere Antworten richtig sind
  (Trainer-Entscheidung 2026-11-23, siehe `docs/QUIZ.md`).
- `text` und `answers[].text` sind HTML aus der Allowlist (`code`, `pre`, `strong`, `em`, `br`).
  `code` ist Klartext.
- `serverNow` ist die Serverzeit beim Antworten. Der Client gleicht damit seine Uhr ab (der `Date`-Header ist
  über CORS nicht lesbar).
- `selectedAnswerIds` ist der zuletzt gespeicherte Stand (Autosave), anfangs leer.

### Abgegebener Attempt (`200` bei `submit` und bei `GET` nach der Abgabe)

```json
{
  "id": "6b0f…",
  "status": "submitted",
  "categories": [{ "id": "6afc…", "name": "JavaScript im Browser (DOM)" }],
  "questionCount": 2,
  "timeLimitSec": 600,
  "startedAt": "2026-11-22T09:00:00.000Z",
  "deadline": "2026-11-22T09:10:00.000Z",
  "submittedAt": "2026-11-22T09:04:12.000Z",
  "durationSec": 252,
  "timedOut": false,
  "result": { "correct": 1, "wrong": 0, "unanswered": 1, "total": 2 },
  "questions": [
    {
      "id": "6afd…",
      "text": "Was gibt <code>typeof null</code> zurück?",
      "code": "",
      "outcome": "correct",
      "selectedAnswerIds": ["6afd…a1"],
      "successMessage": "",
      "errorMessage": "",
      "note": "",
      "answers": [
        { "id": "6afd…a1", "text": "<code>\"object\"</code>", "isCorrect": true, "explanation": "" },
        { "id": "6afd…a2", "text": "<code>\"null\"</code>", "isCorrect": false, "explanation": "" }
      ]
    }
  ]
}
```

- `outcome` ist `"correct"`, `"wrong"` oder `"unanswered"`.
- **Bewertung:** richtig, wenn die gewählte Menge **genau** der Menge der richtigen Antworten entspricht
  (Reihenfolge egal). Keine Auswahl = unbeantwortet. Alles andere = falsch.
- Leere `successMessage`/`errorMessage` füllt der Client mit Standardtexten.
- `durationSec` ist höchstens `timeLimitSec`.
- Wurde eine Frage nach dem Start gelöscht, steht sie als `{ "id", "removed": true, "outcome": "unanswered",
  "selectedAnswerIds" }` ohne Text und Antworten in der Liste und zählt als unbeantwortet. Beim laufenden
  Attempt: `{ "id", "removed": true, "selectedAnswerIds": [] }`.

### Antworten speichern und abgeben

Body für `PUT /attempts/:id/answers` und `POST /attempts/:id/submit`:

```json
{ "answers": [{ "questionId": "6afd…", "selectedAnswerIds": ["6afd…a1"] }] }
```

- `answers` ist ein Array mit höchstens 30 Einträgen, `selectedAnswerIds` ein Array aus höchstens 6 Strings
  (`ANSWER_COUNT.max` aus `shared/src/question/`: eine Frage hat 2 bis 6 Antworten).
  Sonst 400. `submit` verlangt einen JSON-Body, auch wenn `answers` leer ist (CSRF, siehe „Cookie“).
- `PUT` ersetzt nur die genannten Fragen. `submit` nimmt den Stand des Clients; Fragen, die im Body fehlen,
  behalten den gespeicherten Stand. Doppelte Antwort-IDs zählen einmal.
- 422-Meldungen (`fields.answers`): „Diese Frage gehört nicht zu diesem Test.“, „Mindestens eine Antwort gehört
  nicht zu dieser Frage.“ Mehrere gewählte Antworten sind bei jeder Frage erlaubt; ob sie stimmen, entscheidet
  erst die Bewertung (zwei Häkchen bei nur einer richtigen Antwort = falsch).
- Ist der Attempt schon abgegeben: **409** `ATTEMPT_CLOSED` „Dieser Test ist bereits abgegeben.“ Das gilt auch
  für ein zweites `submit` (Doppelklick, zwei Tabs).

### Zeit

- `deadline = startedAt + timeLimitSec`. Der Server nimmt Antworten bis **15 Sekunden** nach `deadline` an
  (Netzwerk, Auto-Abgabe).
- `submit` vor `deadline` → `timedOut: false`, `submittedAt` = Zeitpunkt der Abgabe.
- `submit` nach `deadline`, aber innerhalb der Toleranz → Antworten zählen, `timedOut: true`,
  `submittedAt` = Zeitpunkt der Abgabe, `durationSec` = `timeLimitSec`.
- `submit` nach der Toleranz → **200**, die Antworten im Body werden ignoriert, es zählt der gespeicherte Stand,
  `timedOut: true`, `submittedAt` = `deadline`, `durationSec` = `timeLimitSec`.
- `PUT` nach der Toleranz → 409 `ATTEMPT_CLOSED`.
- Ein Attempt, dessen Zeit samt Toleranz abgelaufen ist, wird beim nächsten Zugriff (`GET`, Verlauf, `PUT`,
  `submit`, neuer Start) automatisch mit dem gespeicherten Stand ausgewertet — ebenfalls mit
  `submittedAt` = `deadline`.

### Verlauf `GET /attempts?mine=true`

Ohne `mine=true` → 400. Nacktes Array der eigenen Attempts, nach `startedAt` absteigend (neueste zuerst),
höchstens 50:

```json
[
  {
    "id": "6b0f…",
    "status": "submitted",
    "categories": [{ "id": "6afc…", "name": "JavaScript im Browser (DOM)" }],
    "questionCount": 10,
    "timeLimitSec": 600,
    "startedAt": "2026-11-22T09:00:00.000Z",
    "deadline": "2026-11-22T09:10:00.000Z",
    "submittedAt": "2026-11-22T09:04:12.000Z",
    "durationSec": 252,
    "timedOut": false,
    "result": { "correct": 7, "wrong": 2, "unanswered": 1, "total": 10 }
  }
]
```

Laufende Einträge haben `status: "running"`, `submittedAt: null`, `durationSec: null`, `result: null`. Keine
Fragen, keine Lösungen.

### Fehlercodes (neu)

| Code              | Status | Meldung                                                                 |
| ----------------- | -----: | ----------------------------------------------------------------------- |
| `FORBIDDEN`       | 403    | „Dieser Test gehört zu einem anderen Konto.“                            |
| `ATTEMPT_RUNNING` | 409    | „Du hast bereits einen laufenden Test. Setze ihn fort oder gib ihn ab.“ |
| `ATTEMPT_CLOSED`  | 409    | „Dieser Test ist bereits abgegeben.“                                    |

Zum Ausprobieren: `backend/requests/attempts.http` (VS-Code-Extension „REST Client“).
