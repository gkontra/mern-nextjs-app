## Wie `useSyncExternalStore` arbeitet

Der Hook bekommt **zwei Funktionen** und gibt den aktuellen Wert zurück:

| Argument | Aufgabe | Hier |
| --- | --- | --- |
| `subscribe(onChange)` | beim Browser anmelden: „Sag Bescheid, wenn sich etwas ändert.“ Gibt eine Funktion zum **Abmelden** zurück. | `addEventListener('change', onChange)` / `removeEventListener` |
| `getSnapshot()` | den **aktuellen Wert** lesen — ohne Nebenwirkungen | `matchMedia(…).matches` → `true` oder `false` |

Der Ablauf:

```text
erstes Rendern      → React ruft getReduceMotion()        → false → „aus“
                    → React ruft subscribeToReduceMotion(onChange)
Einstellung ändert sich
                    → Browser feuert „change“ → onChange()  (React-intern)
                    → React ruft getReduceMotion()        → true  → neu rendern → „an“
Seite verlassen     → React ruft die zurückgegebene Abmelde-Funktion
```

**Warum nicht `useState` + `useEffect`?** Das ginge auch:

```jsx
const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia(REDUCE_MOTION_QUERY).matches);

useEffect(() => {
  const mediaQuery = window.matchMedia(REDUCE_MOTION_QUERY);
  const handleChange = () => setReduceMotion(mediaQuery.matches);
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

| | `useState` + `useEffect` | `useSyncExternalStore` |
| --- | --- | --- |
| Wo liegt der Wert? | **Kopie** im React-State — kann kurz veralten | React liest **immer** die Quelle selbst |
| Code | Startwert, Listener, Setter, Aufräumen — alles von Hand | zwei kleine Funktionen |
| Gedacht für | Werte, die React selbst verwaltet | Werte, die **außerhalb** von React leben |

> **Merke:** `useSyncExternalStore` ist selten — immer dann, wenn eine Quelle **außerhalb**
> von React einen Wert hat und Änderungen meldet: Media-Queries, `navigator.onLine`,
> Fenstergröße, `localStorage` in anderen Tabs, externe Store-Bibliotheken.

**Stolperfalle:** `subscribe` und `getSnapshot` müssen **außerhalb** der Komponente stehen
(oder stabil sein). Neu erzeugte Funktionen bei jedem Rendern führen dazu, dass React bei jedem
Rendern ab- und wieder anmeldet. Und `getSnapshot` muss bei gleicher Lage **denselben** Wert
liefern — ein `true`/`false` ist dafür ideal, ein jedes Mal neues Objekt wäre ein Fehler
(Endlosschleife).

**`role="status"`** — Screenreader sagen die Änderung an, ohne dass der Fokus springt.