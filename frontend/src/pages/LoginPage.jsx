import { Link, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import AuthForm from '../components/forms/AuthForm';
import FormField from '../components/forms/contents/FormField';
import useAuthForm from '../hooks/useAuthForm';
import { validateLogin } from '../lib/authValidation';
import { getSafeRedirectPath } from '../lib/safeRedirect';
import { AUTH_STATUS, useAuth } from '../stores/auth';

const DemoLoginHint =
  import.meta.env.VITE_USE_MOCK_API === 'true'
    ? lazy(() => import('../components/forms/contents/DemoLoginHint'))
    : null;

const LoginPage = () => {
  const { login, isAuthenticated, status } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const { field, handleSubmit, formError, alertRef } = useAuthForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
    onSubmit: login,
  });

  if (isAuthenticated) {
    return <Navigate to={getSafeRedirectPath(from)} replace />;
  }

  return (
    <div className="page-auth page-login">
      <title>Login · JS-Kurs</title>
      <div className="container">
        {status === AUTH_STATUS.LOADING ? (
          <p role="status">Sitzung wird geprüft …</p>
        ) : (
          <>
            <AuthForm
              title="Willkommen"
              accent="zurück"
              intro="Melde dich an, um Tests zu starten und deinen Verlauf zu sehen."
              onSubmit={handleSubmit}
              formError={formError}
              alertRef={alertRef}
              isSubmitting={status === AUTH_STATUS.SUBMITTING}
              submitLabel="Anmelden"
              submittingLabel="Wird angemeldet …"
              footer={
                <p>
                  Noch kein Konto?{' '}
                  <Link to="/register" state={{ from }}>
                    Jetzt registrieren
                  </Link>
                </p>
              }>
              <FormField {...field('email')} label="E-Mail" type="email" autoComplete="email" required />
              <FormField
                {...field('password')}
                label="Passwort"
                type="password"
                autoComplete="current-password"
                required
              />
            </AuthForm>
            {DemoLoginHint && (
              <Suspense fallback={null}>
                <DemoLoginHint />
              </Suspense>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
