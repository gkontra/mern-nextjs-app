import modules from './modules.mock.json'; // dank vite json Dateien importieren und liegen als geparste Objekte vor.

export const fetchModules = async ({ signal } = {}) => {
  if (signal?.aborted) {
    throw new DOMException('Die Anfrage wurde abgebrochen.', 'AbortError');
  }

  return structuredClone(modules);
};
