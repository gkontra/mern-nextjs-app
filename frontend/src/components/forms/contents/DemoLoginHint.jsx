import { ROLE_LABELS } from '../../../lib/roles';
import { DEMO_ACCOUNTS, SERVER_ERROR_EMAIL } from '../../../services/authService.mock';

const IS_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const DemoLoginHint = () => {
  return (
    <aside className="m-demo-login-hint demo-login-hint" aria-labelledby="demo-login-title">
      <h2 className="hint-title" id="demo-login-title">
        Demo-Modus
      </h2>
      {IS_MOCK_API ? (
        <p>Die Anmeldung läuft gegen eine Mock-API im Browser. Diese Zugänge funktionieren:</p>
      ) : (
        <p>
          Die Anmeldung läuft gegen das Express-Backend. Diese Zugänge legt <code>npm run seed</code> an:
        </p>
      )}
      <ul className="hint-list">
        {DEMO_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <code>{account.email}</code> / <code>{account.password}</code> ({ROLE_LABELS[account.role]})
          </li>
        ))}
      </ul>
      <p>
        <code>{SERVER_ERROR_EMAIL}</code> erzeugt einen Serverfehler (500).
      </p>
    </aside>
  );
};

export default DemoLoginHint;
