import axios from 'axios';
import api from './api';

export const fetchModules = async ({ signal } = {}) => {
  const response = await api.get(import.meta.env.VITE_USE_MOCK_API === 'true' ? '/modules.json' : '/modules', {
    signal,
  }); //

  if (!Array.isArray(response.data)) {
    throw new Error('Die Antwort enthält keine Modulliste.');
  }

  return response.data;
};

export const isRequestCanceled = (error) => axios.isCancel(error);

export const getErrorMessage = (error) => {
  if (!axios.isAxiosError(error)) return error.message;
  if (error.response) return `Der Server antwortete mit Status ${error.response.status}.`;
  if (error.code === 'ECONNABORTED') return 'Der Server hat zu lange nicht geantwortet.';
  return 'Der Server ist nicht erreichbar.';
};
