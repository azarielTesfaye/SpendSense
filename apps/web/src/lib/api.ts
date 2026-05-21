import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./auth-constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type QueryValue = string | number | boolean | null | undefined;

export interface ApiClientConfig {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  endpoint: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  fetchOptions?: RequestInit;
  next?: NextFetchOptions;
  cache?: RequestCache;
  responseType?: "json" | "blob" | "text";
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return { ...headers };
}

function getErrorMessage(parsedError: unknown, status: number, contentType: string) {
  if (contentType.includes("text/html")) {
    return `Request failed with status ${status}`;
  }

  const errorObject =
    parsedError && typeof parsedError === "object"
      ? (parsedError as Record<string, unknown>)
      : null;

  return (
    (errorObject?.message as string | undefined) ||
    (errorObject?.error as string | undefined) ||
    (typeof parsedError === "string" ? parsedError : undefined) ||
    `Request failed with status ${status}`
  );
}

export async function apiClient<T>(config: ApiClientConfig): Promise<T> {
  const {
    method,
    endpoint,
    query = {},
    body,
    fetchOptions,
    cache,
    next,
    responseType = "json",
  } = config;

  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME as any)?.value;
  const authHeader: Record<string, string> | undefined = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  let baseUrlAndEndpoint = `${API_BASE_URL}${endpoint}`;
  if (!baseUrlAndEndpoint.endsWith('/')) {
    baseUrlAndEndpoint += '/';
  }
  const url = `${baseUrlAndEndpoint}${searchParams.toString() ? `?${searchParams}` : ""}`;

  if (process.env.NODE_ENV === "development") {
    const bodyLog =
      body instanceof FormData
        ? Object.fromEntries(body.entries())
        : body;
    console.log("Prepared url:", url, "Method:", method, "Body:", bodyLog);
  }
  
  const headers = normalizeHeaders(fetchOptions?.headers);
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const mergedHeaders = { ...headers, ...(authHeader ?? {}) };
  const finalFetchOptions = { ...fetchOptions, headers: mergedHeaders };

  const response = await fetch(url, {
    method,
    body: requestBody,
    credentials: "include",
    ...finalFetchOptions,
    ...(next ? { next } : {}),
    ...(cache ? { cache } : {}),
  });

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let parsedError: unknown = null;

    try {
      if (contentType.includes("application/json")) {
        parsedError = await response.json();
      } else {
        parsedError = await response.text();
      }
    } catch {
      parsedError = null;
    }

    const message = getErrorMessage(parsedError, response.status, contentType);
    console.log({contentType})
    console.log("Prepared failed url:", url, "Method:", method);

    throw new ApiError(message, response.status, parsedError);
  }

  switch (responseType) {
    case "blob":
      return (await response.blob()) as T;
    case "text":
      return (await response.text()) as T;
    default:
      if (!response.headers.get("content-type")?.includes("application/json")) {
        return undefined as T;
      }
      return (await response.json()) as T;
  }
}

