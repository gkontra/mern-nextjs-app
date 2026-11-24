import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/data',
  timeout: 8000,
  withCredentials: true, // schickt Cookies mit (wird für Login benötigt)
});

export default api;
