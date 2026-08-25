export const env = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3333',
}
