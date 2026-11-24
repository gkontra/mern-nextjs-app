import { Link, Navigate, useLocation } from 'react-router-dom';

import AuthForm from '../components/forms/AuthForm';
import FormField from '../components/forms/contents/FormField';
import useAuthForm from '../hooks/useAuthForm';
import { PASSWORD_MIN_LENGTH, validateRegister } from '../lib/authValidation';
import { getSafeRedirectPath } from '../lib/safeRedirect';
import { API_ERROR_CODE } from '../services/apiError';
import { AUTH_STATUS, useAuth } from '../stores/auth';

const RegisterPage = () => {
  const { register, isAuthenticated, status } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const { field, handleSubmit, formError, alertRef } = useAuthForm({
    initialValues: { name: '', email: '', password: '', passwordConfirm: '' },
    validate: validateRegister,
    onSubmit: ({ name, email, password }) => register({ name, email, password }),
    fieldForErrorCode: { [API_ERROR_CODE.EMAIL_TAKEN]: 'email' },
  });

  if (isAuthenticated) {
    return <Navigate to={getSafeRedirectPath(from)} replace />;
  }

  return (
    <div className="page-auth page-register">
      <title>Registrieren · JS-Kurs</title>
      <div className="container">
        {status === AUTH_STATUS.LOADING ? (
          <p role="status">Sitzung wird geprüft …</p>
        ) : (
          <AuthForm
            title="Konto"
            accent="anlegen"
            intro="Mit einem Konto speicherst du deine Testergebnisse."
            onSubmit={handleSubmit}
            formError={formError}
            alertRef={alertRef}
            isSubmitting={status === AUTH_STATUS.SUBMITTING}
            submitLabel="Registrieren"
            submittingLabel="Konto wird angelegt …"
            footer={
              <p>
                Schon registriert?{' '}
                <Link to="/login" state={{ from }}>
                  Zum Login
                </Link>
              </p>
            }>
            <FormField {...field('name')} label="Name" autoComplete="name" required />
            <FormField {...field('email')} label="E-Mail" type="email" autoComplete="email" required />
            <FormField
              {...field('password')}
              label="Passwort"
              type="password"
              autoComplete="new-password"
              hint={`Mindestens ${PASSWORD_MIN_LENGTH} Zeichen.`}
              required
            />
            <FormField
              {...field('passwordConfirm')}
              label="Passwort wiederholen"
              type="password"
              autoComplete="new-password"
              required
            />
          </AuthForm>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
