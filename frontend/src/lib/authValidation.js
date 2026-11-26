import { validateRegistration } from '@mearn/shared/auth';
import { withoutEmpty } from '@mearn/shared/lib';

export const validateRegister = (values) =>
  withoutEmpty({
    ...validateRegistration(values),
    passwordConfirm: values.passwordConfirm !== values.password ? 'Die Passwörter stimmen nicht überein.' : null,
  });
