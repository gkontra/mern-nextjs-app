## Cookies

**`lax`** ist keine Abkürzung, sondern das englische Wort für **„locker“** oder **„entspannt“**.

Beim `SameSite`-Attribut von Cookies steht `lax` für den **goldenen Mittelweg** zwischen Sicherheit (Schutz vor CSRF-Angriffen) und Nutzerfreundlichkeit. Es ist mittlerweile auch der Standardwert in allen modernen Browsern, wenn `SameSite` gar nicht angegeben wird.

Konkret bedeutet `sameSite: 'lax'`:

* **Wird mitgesendet:** Bei normalen Top-Level-Navigationen (z. B. wenn jemand auf einer fremden Seite auf einen Link zu deiner App klickt – klassischer `GET`-Request). Der Nutzer bleibt also eingeloggt.
* **Wird blockiert:** Bei Cross-Site-Anfragen im Hintergrund, wie `POST`-Formularen, `fetch`/`XHR`-Requests, `<iframe>`-Einbettungen oder Bildern von fremden Domains.

### Die drei `SameSite`-Werte im Vergleich

| Wert | Verhalten | Typischer Einsatz |
| --- | --- | --- |
| **`strict`** | Cookie wird **nur** gesendet, wenn die Anfrage direkt von deiner eigenen Domain kommt. Selbst ein Klick auf einen externen Link schickt das Cookie nicht mit. | Banking, sehr sensible Admin-Bereiche |
| **`lax`** | Cookie wird bei sicheren externen Links (`GET`) mitgesendet, aber bei Cross-Site-`POST`s, `fetch` oder `iframes` blockiert. | Standard für fast alle Login-Sessions |
| **`none`** | Cookie wird **immer** mitgesendet (auch Cross-Site). Erfordert zwingend `secure: true` (HTTPS). | Eingebettete Widgets, Cross-Domain-APIs, Tracking |