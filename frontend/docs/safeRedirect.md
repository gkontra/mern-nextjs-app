# safeRedirect - sichere Weiterleitung 

Wer auf `/profile` will und nicht angemeldet ist, landet auf `/login` . Nach dem Login
soll er **zurück** nach `/profile`. Die Zieladresse kommt aus `location.state.from` — und alles, was
in `location` steht, kann manipuliert sein.

```js
export const DEFAULT_REDIRECT = '/profile';

const AUTH_PATHS = ['/login', '/register'];

export const getSafeRedirectPath = (from) => {
  if (typeof from?.pathname !== 'string') {
    return DEFAULT_REDIRECT;
  }

  const isLocalPath = from.pathname.startsWith('/') && !from.pathname.startsWith('//') && !from.pathname.startsWith('/\\');

  if (!isLocalPath || AUTH_PATHS.includes(from.pathname)) {
    return DEFAULT_REDIRECT;
  }

  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
};
```

| `from.pathname` | Ergebnis | Warum |
| --- | --- | --- |
| `/modules/2` (+ `?a=1#x`) | `/modules/2?a=1#x` | eigene Seite → ok |
| fehlt / `undefined` | `/profile` | direkter Aufruf von `/login` |
| `//evil.example` | `/profile` | `//…` ist eine **protokoll-relative URL** → fremde Domain |
| `/\evil.example` | `/profile` | manche Browser machen aus `\` ein `/` |
| `https://evil.example` | `/profile` | beginnt nicht mit `/` |
| `/login`, `/register` | `/profile` | sonst Schleife: Login → Login |

> **Open Redirect:** Eine Seite, die ungeprüft auf eine Adresse aus der URL weiterleitet, lässt
> sich für Phishing missbrauchen: Der Link zeigt auf **unsere** Domain, nach dem Login landet man
> aber auf einer gefälschten Seite.