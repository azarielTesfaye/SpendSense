import axios, { type AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export function createApiClient(getAccessToken?: () => string | null): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getAccessToken?.();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

