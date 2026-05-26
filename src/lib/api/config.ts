/** API origin: full URL in production; same-origin (Vite proxy) in dev. */
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return "";
  }

  const fromEnv = import.meta.env.VITE_BLOOD_DONATION_API_BASE_URL as string | undefined;
  return (fromEnv ?? "http://localhost:8000").replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}
