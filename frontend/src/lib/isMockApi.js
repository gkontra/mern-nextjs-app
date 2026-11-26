export const isMockApi = () => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};
export const IS_MOCK_API = isMockApi();

export default isMockApi;
