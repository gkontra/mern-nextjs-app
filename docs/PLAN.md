# PLAN — mearn-app

Status: **Meilenstein R abgeschlossen (Smoke-Test B bestätigt am 2026-11-24)** · aktiv: **Meilenstein 6 – Next.js-Admin**

Nach jedem Meilenstein stoppt der Agent und wartet auf die Bestätigung des Trainers.

| #   | Meilenstein                                                   | Status    |
| --- | ------------------------------------------------------------- | --------- |
| 0   | Projektanweisung (AGENTS.md, Skills, Docs)                    | ✅ fertig |
| 1   | Startseite mit GSAP-Scroll-Animationen                        | ✅ fertig |
| 2   | Aufräumen + Login & Auth (Client, Mock-API)                   | ✅ fertig |
| 3   | Express-Backend + MongoDB: Auth, Module, Quiz-Modelle, Seed   | ✅ fertig |
| 4   | Frontend an echte API, CORS-Lektion                           | ✅ fertig |
| 5   | Quiz in der MERN-App (Test zusammenstellen, Timer, Auswertung, Verlauf) | ✅ fertig |
| R   | Regeln an einer Stelle: Paket `@mearn/shared` (`shared/`)      | ✅ fertig |
| 6   | Next.js-Admin: Module + Quiz-Pflege (Kategorien, Fragen)      | ▶ aktiv   |
| 7   | README: Architekturkontrast (PRD §6.4)                        | offen     |

Quiz-Spezifikation: [`docs/QUIZ.md`](QUIZ.md).

## Meilenstein 1 – Startseite (✅ fertig)

Abgeschlossen am 2026-11-16 (Smoke-Tests Teil A und Teil B vom Trainer bestätigt). Umgesetzt:

1. Aufräumen: Wetter-Platzhalter aus `HomePage.jsx` und `.env`, `console.log` aus `App.jsx`;
   Nerdshop-Routen entfernt (Dateien bleiben liegen); `.env` in `.gitignore`.
2. `gsap` + `@gsap/react` installiert, `src/lib/gsap.js` (`MEDIA`, `MOTION`); Vendor-Chunks
   in `vite.config.js`.
3. Schriften lokal: Open Sans, Source Code Pro, Telma (Telma git-ignoriert, Installation in
   den Trainer-Notizen); Farb-Aliase, Tokens und Mixins in `abstracts/`.
4. `public/data/modules.json` (7 Module, Titel = eingebrannte Bildtitel),
   `services/api.js`, `services/modulesService.js`, `stores/modules/`.
5. Modulbilder als WebP nach `public/img/modules/`.
6. UI-Bausteine: `TextSplit`, `CommentCard`, `MultiplayerCursor`, `SelectionFrame`,
   `SegmentToggle`; offizielle Logos MongoDB/Convex nach `public/img/logos/`.
7. Sections in Reihenfolge: `HeroSection`, `ModulesCollageSection`, `BrowserSection`,
   `StackSwitchSection`, `CodeSection`, `CtaSection`, `ModulesSection` + `ModuleCard`;
   SCSS je Komponente.
8. `HeaderMain` auf `/` ausgeblendet, `NavMain` transparent über dem Hero mit Start / Module /
   Kontakt; `ScrollToTop` (inkl. `/#modules`); Routen `/modules/:moduleId`
   (`ModuleDetailPage`), `/contact`, `*` (`NotFoundPage`).
9. `FooterMain` mit Kursinhalt; `NavSocialMedia` mit GFN-Links (X noch ohne Konto).
10. Browser-Check (Desktop, Mobile, reduced-motion, Tastatur, Routenwechsel), Kontraste,
    Trainer-Notizen, Closeout.

## Meilenstein 2 – Aufräumen + Login & Auth (✅ fertig)

Abgeschlossen am 2026-11-16 (Smoke-Test vom Trainer bestätigt). Plan:
`docs/reports/2026-11-16-m2-plan.md`, Bericht: `docs/reports/2026-11-16-m2-build.md`.
Zum Abschluss: Font Awesome (CDN-`@import`) aus `main.scss` genommen — `styles/icons/` bleibt
als Ordner bestehen (7-1-Regel in `frontend/AGENTS.md`).

0. Aufräumen: Nerdshop-Demo löschen (`stores/products`, `TableProducts*`, `RowProduct`,
   `Input*`, `nerdshop-products.json` in `public/` und `src/assets/`, zugehörige SCSS-Partials
   und `_index.scss`-Einträge, leere `stores/games|movies|todos`, `pages/projects`,
   `ProjectsPage`); `Logo.jsx` auf Palettenfarben; `dist/` nicht anfassen.
1. `services/authService.js` + `authService.mock.js`, `VITE_USE_MOCK_API`, `VITE_API_URL`
   in `.env-example`.
2. `stores/auth/` + `useAuth()`, Session-Restore beim App-Start; User-Objekt mit `role`
   (`participant` | `trainer`, siehe `docs/QUIZ.md`).
3. `FormField`, `LoginPage`, `RegisterPage`, `ProfilePage`.
4. `ProtectedRoute`, Routen ergänzen, `NavMain` auth-abhängig. `ProfilePage` mit Platzhalter
   „Testverlauf“ (füllt Meilenstein 5).
5. Browser-Check (Login ok/falsch, Register-Konflikt, Redirect zurück, Logout), Notizen,
   Closeout.

## Meilenstein 3 – Express-Backend + MongoDB (✅ fertig)

Gebaut am 2026-11-17. Plan: `docs/reports/2026-11-17-m3-plan.md` (freigegeben, Trainer-Entscheidungen
zu §8 im Build-Auftrag). Berichte: `docs/reports/2026-11-17-m3-build-a.md`,
`docs/reports/2026-11-17-m3-build-b.md`, Import: `docs/reports/2026-11-17-m3-import.md`.
Abgeschlossen, sobald der Trainer Smoke-Test B bestätigt.

- **Teil A** — Setup, Config/DB/App/Server, Fehlerbehandlung, Auth, Module, Seed
  (Smoke-Test bestätigt).
- **Teil B** — Modelle `Category`, `Question`, `Attempt` (ohne Routen); Import
  `questions.json` (9 Kategorien, 237 Fragen: 228 `published`, 9 `draft`; nur einfügen);
  `GET /api/categories`; 23 Tests mit vitest + supertest gegen `mearn-app-test`.
- **Nachtrag 2026-11-25 (Trainer):** Altfragen aus `MATERIAL/` sind urheberrechtlich geschützt und
  werden ersetzt durch eigene Fragen in `backend/seed-data/quiz.json` (Zielformat wie `modules.json`):
  8 Kategorien × 6 veröffentlichte Fragen (Module 1–7 + Backend) und `nextjs` mit 2 Entwürfen
  (leere Kategorie im Quiz). `Question.seedKey` ersetzt `legacyId`/`legacyIdx`;
  `src/lib/quizSeed.js` ersetzt `legacyQuestions.js`; Test `test/quizSeed.test.js` prüft die Datei.
  Bestehende Datenbanken einmal leeren (`attempts`, `questions`, `categories`), dann `npm run import`.

## Meilenstein 4 – Frontend an echte API, CORS-Lektion (✅ fertig)

Gebaut und abgeschlossen am 2026-11-19 (Smoke-Tests A und B vom Trainer bestätigt). Plan:
`docs/reports/2026-11-17-m4-plan.md` (Entscheidungen des Trainers zu §11 in den Build-Aufträgen).
Berichte: `docs/reports/2026-11-19-m4-build-a.md`, `docs/reports/2026-11-19-m4-build-b.md`.

- **Teil A — Smoke-Test A bestätigt am 2026-11-19 (16/16).** SPA gegen Express
  (`VITE_API_URL=http://localhost:3000/api`, Flag `false`, Fallback `'/api'`);
  `modulesService` mit `toApiError` und eigenem Mock (`modulesService.mock.js` +
  `modules.mock.json`, Entscheidung 1a); `backend/seed-data/modules.json` als einzige
  Seed-Quelle, `frontend/public/data/` entfernt; `DemoLoginHint` im Dev in beiden Modi;
  `reload` bleibt ohne `AbortController` (Entscheidung 5); Seed-Fix über
  `backend/src/lib/insertOnly.js` (+ 2 Tests, jetzt 25); drei Terminals.
- **Teil B — Smoke-Test B bestätigt am 2026-11-19** (E0–E5b, E7 live; E6/E8 aufgezeichnet).
  CORS-Experimente E0–E8 mit Chrome 157 aufgezeichnet (Texte wörtlich in den Trainer-Notizen);
  Same-Origin vs. Same-Site, Lernpunkte, Proxy-Vergleich, Ausblick Produktion; CORS-Abschnitt
  in `docs/API.md`. Kein Code geändert; echtes CORS bleibt Standard, eine exakte Origin
  (Entscheidungen 8–10).

## Meilenstein 5 – Quiz in der MERN-App (✅ fertig)

Spezifikation: [`docs/QUIZ.md`](QUIZ.md). Plan: [`docs/reports/2026-11-22-m5-plan.md`](reports/2026-11-22-m5-plan.md)
(alle Empfehlungen aus §8 angenommen, Ergänzungen A1–A4 im Abschnitt „Entscheidungen des Trainers“).

- **Teil A — Smoke-Test A bestätigt am 2026-11-22 (A1–A19, 50/50 Tests).** Attempts-API unter `/api/attempts`
  (Start mit `$match` + `$sample`, gemischte Antworten, Autosave, Abgabe, Verlauf), Zeit und Bewertung auf dem
  Server (15 s Toleranz, finalize on read, `submittedAt = deadline` nach der Toleranz), ein laufender Attempt
  je Konto (Teilindex), 401/403/404 getrennt; 50 Tests (25 neu); `backend/requests/attempts.http`;
  Vertrag in `docs/API.md`. Bericht: `docs/reports/2026-11-22-m5-build-a.md`.
- **Teil B1 — Smoke-Test B1 am 2026-11-23: S1–S5, S7–S9, S11, S13, S14, S16, S18 bestanden** (S7 durch den
  Nachtrag überholt). Frontend: `quizService.js` (kein Quiz-Mock,
  Entscheidung 1b), Routen `/quiz`, `/quiz/:attemptId`, `/quiz/:attemptId/result` (geschützt, ohne `HeaderMain`),
  Nav-Link „Quiz“; Setup-Seite mit Kategorien, Anzahl, Zeitlimit und Hinweis auf den laufenden Test; eine Frage je
  Ansicht (`?frage=`), Antworten mit Hinweis, `RichText` als einzige HTML-Stelle; Autosave je Frage
  nacheinander (A2); Abgabe mit Bestätigung; Auswertung als Zusammenfassung. Bericht:
  `docs/reports/2026-11-22-m5-build-b1.md`.
- **Nachtrag nach B1 — gebaut am 2026-11-23, bestätigt mit Smoke-Test B2 am 2026-11-24.** (1) Immer Checkboxen, API ohne `multiple`,
  keine 422 „nur eine Antwort“ mehr (Entscheidung A5, Begründung in `docs/QUIZ.md`). (2) Öffentliche
  Inhalte-Seiten `/inhalte/agenda` (Marp-Deck als Karten mit GSAP-Scroll-Reveal) und `/inhalte/links`, Kopien
  in `frontend/src/content/`, Dropdown „Inhalte“ in der Navigation. Bericht:
  `docs/reports/2026-11-23-m5-followup.md`.
- **Teil B2 — gebaut am 2026-11-24, Smoke-Test B2 bestätigt am 2026-11-24** (T1, T2, T4, T6–T9, T13 live;
  T5 und T10 im Agenten-Lauf; T3 VoiceOver vom Trainer gestrichen, Ansagen per Mitschnitt der Live-Regionen
  geprüft; T11/T12 optional, nicht durchgeführt). Countdown aus `deadline` und Uhr-Offset
  (`serverNow`), nie gezählt; Timer mit `role="timer"` und Ansagen nur an Schwellen; Auto-Abgabe bei 0, einmal je
  Seitenaufruf; Auswertung je Frage (`QuizResultItem`) mit Standardtexten und Markern „Deine Wahl“ /
  „Richtige Antwort“; Verlauf auf `/profile` (`AttemptHistory`); Sitzungsfehler in `ProtectedRoute` mit
  „Erneut versuchen“ (Entscheidung 8a). Bericht: `docs/reports/2026-11-24-m5-build-b2.md`.

Abgeschlossen am 2026-11-24.

## Meilenstein R – Regeln an einer Stelle (`shared/`) (✅ fertig)

Eingeschoben vor Meilenstein 6, ohne Umnummerierung: Prüfregeln, Grenzen und Meldungen, die Frontend, Backend und
später der Admin brauchen, stehen einmal im Paket `@mearn/shared` (`shared/` auf Root-Ebene, eingebunden mit
`"@mearn/shared": "file:../shared"`). Plan: [`docs/reports/2026-11-24-refactor-plan.md`](reports/2026-11-24-refactor-plan.md)
(alle Empfehlungen aus §7 angenommen).

- **Teil A — R1–R3 gebaut am 2026-11-24, Smoke-Test A bestätigt am 2026-11-24 (1–12).** R1 Paket anlegen (`withoutEmpty`, `formatList`,
  `byteLength`), `npm install ../shared` in `frontend/` und `backend/`, `lint:shared` im Backend; R2 Quiz-Regeln
  (`TIME_LIMITS_SEC`, `QUESTION_COUNT`, `validateQuizSetup`, Meldungen, Zeitlimit-Text aus der Liste erzeugt); R3
  Auth-Regeln (`validateRegistration`/`validateLogin` auf allen drei Seiten, Sperrliste und 72-Byte-Grenze auch im
  Client, Login prüft nur „nicht leer“, neue Texte). 52/52 Tests unverändert grün. Bericht:
  `docs/reports/2026-11-24-r-build-a.md`.
- **Teil B — R4–R6 gebaut am 2026-11-24, Smoke-Test B bestätigt am 2026-11-24 (1–8, 6 im Mock-Modus).** R4 Modell-Regeln für den Admin, nur verschoben:
  `shared/src/question` (`ANSWER_COUNT`, `QUESTION_STATUS`, `ALLOWED_TAGS`, `hasValidAnswers`, Antworten-Text),
  `module` (`MODULE_ID` 1–7, `MODULE_STATUS`, moduleId-Text einmal statt zweimal), `user` (`ROLES`, `ROLE_LABELS`);
  `MAX_SELECTED_ANSWERS = ANSWER_COUNT.max`; `frontend/src/lib/roles.js` gelöscht. R5 `shared/src/errors`
  (`ERROR_CODE`, `ERROR_MESSAGES`) für Backend, Frontend-`apiError.js` und Mock; Browser-Codes bleiben im Frontend.
  R6 Doku (`AGENTS.md`, `frontend/AGENTS.md`, `docs/API.md`). Keine sichtbare Textänderung; 52/52 Tests
  unverändert grün; `seed`/`import` laufen. Bericht: `docs/reports/2026-11-24-r-build-b.md`.

Abgeschlossen am 2026-11-24.

## Meilenstein 6 – Next.js-Admin (▶ aktiv)

Module und Quiz-Pflege (Kategorien, Fragen, Entwürfe freigeben) in einer eigenen Next.js-App auf derselben
Datenbank; das Express-Backend bekommt dafür keine Verwaltungs-Endpunkte (Kursleitlinie 2026-11-23). Regeln und
Meldungen kommen aus `@mearn/shared` (Meilenstein R).

Entscheidungen des Trainers (2026-11-24), Probe-Build im Planungs-Chat bestätigt:

- **TypeScript** im Admin (strict). Die MERN-App bleibt JavaScript (Entscheidung vom 2026-11-16 gilt dort weiter).
- Next.js 16.4 über `create-next-app` mit `--ts --app --src-dir --react-compiler --cache-components
  --no-tailwind --eslint`; Turbopack ist Standard. **Cache Components bleiben an.**
- **Tabler** (`@tabler/core`, `@tabler/icons-react`, MIT) statt Dash UI: Sass mit `@use`, keine
  Sass-Warnungen, keine CDN-Schriften. Eigene 7-1-Struktur unter `admin-dashboard/src/styles/`, Kursfarbe
  `#5c4b51` als `$primary`.
- `@mearn/shared` mit `turbopack.root: path.join(import.meta.dirname, '..')`; `transpilePackages` nicht nötig.
- `browserslist` auf Tablers Mindestversionen (Chrome/Edge 123, Firefox 128, Safari 17.5), sonst bricht
  `light-dark()` in dunklen Bereichen.
- Port **3001**; Linter bleibt ESLint mit `eslint-config-next`.
- Schritt 1 = Anleitung `docs/anleitungen/admin/00_installation-struktur.md` (Gerüst, Layout, Platzhalterseiten).
- **Nachtrag 2026-11-26 (Trainer):** Vor dem ersten Prompt bekommt das Projekt das Agent-Grundgerüst
  nach `~/Documents/KI/basis-preset` (Kern): `AGENTS.md` je Bereich (Root, `admin-dashboard/`,
  `admin-dashboard/src/styles/`), `CLAUDE.md` als Symlink per `scripts/link-agent-files.sh`
  (`--import` für Windows), Skills `phase-closeout`, `new-component`, `preflight`,
  `.claude/settings.json` mit leerer `attribution`, `scripts/check-attribution.mjs` in `npm run lint`
  (Projektordner statt Git-Wurzel, `scripts/attribution-ignore.txt` für alte Commits). Danach die
  Projektanweisungen im Claude-Projekt mit den acht Grundregeln des Trainers (Release → Abschluss
  eines Feature-Blocks). Admin 0: Teil B = Etappe 7–12, Teil C = 13–15. KI 0 erklärt die Regeln
  in Etappe 9.

### Schritt 1 — Admin 0 (Grundgerüst)

- [x] Teil A: `admin-dashboard/` mit Next.js 16.4.6, `@mearn/shared`, Tabler, Sass, `browserslist`, Port 3001
  (im Planungs-Chat erzeugt und geprüft: `npm ci`, `npm run lint`, `npm run build` grün)
- [x] Teil B: `admin-dashboard/AGENTS.md` (Next-Block + Admin-Regeln), `admin-dashboard/src/styles/AGENTS.md`,
  `CLAUDE.md` als Import (`@AGENTS.md`, wie im restlichen Repo), `scripts/`, `.claude/settings.json`,
  `.claude/skills/` (`preflight`, `new-component`, `phase-closeout`). Im Referenzprojekt ist
  `docs/anleitungen/` von der Urheberschafts-Prüfung ausgenommen (die Anleitungen zitieren das Skript).
- [ ] Teil C, Etappe 13: SCSS 7-1, Farben und Schriften wie im Frontend (ohne Telma) — Prompt aus dem
  Claude-Projekt „NextJS Course“
- [ ] Teil C, Etappe 14: Layout mit Seitenleiste, Platzhalterseiten
- [ ] Teil C, Etappe 15: Gesamttest, Feature-Block abschließen

## Entscheidungen des Trainers (2026-11-16)

- JavaScript/JSX bleibt (kein TypeScript in der MERN-App).
- Ordnerstruktur `frontend/` + `backend/` bleibt; Workspaces werden in Meilenstein 3 neu bewertet.
- Nerdshop-Demo wird gelöscht und durch das Quiz ersetzt (`docs/QUIZ.md`).
- Quiz: Pflege im Next.js-Admin; Teilnehmende stellen Tests selbst zusammen; eine oder
  mehrere richtige Antworten; Ergebnisse pro Nutzer mit Verlauf.
