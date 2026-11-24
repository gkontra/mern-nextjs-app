export const DEFAULT_REDIRECT = '/profile';

const AUTH_PATHS = ['/login', '/register'];

export const getSafeRedirectPath = (from) => {
  if (typeof from?.pathname !== 'string') {
    return DEFAULT_REDIRECT;
  }

  const isLocalPath =
    from.pathname.startsWith('/') && !from.pathname.startsWith('//') && !from.pathname.startsWith('/\\');

  if (!isLocalPath || AUTH_PATHS.includes(from.pathname)) {
    return DEFAULT_REDIRECT;
  }

  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
};
