
const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const csrfEndpoint = "/api/method/lendit.lendit.api.get_csrf_token";

interface CsrfTokenResponse {
  message?: unknown;
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;
let csrfGeneration = 0;

async function fetchCsrfToken(forceRefresh = false): Promise<string> {
  if (forceRefresh) {
    csrfGeneration += 1;
    csrfToken = null;
    csrfTokenRequest = null;
  }

  if (csrfToken) {
    return csrfToken;
  }

  if (csrfTokenRequest) {
    return csrfTokenRequest;
  }

  const generation = csrfGeneration;

  const request = (async (): Promise<string> => {
    const response = await fetch(`${apiBaseUrl}${csrfEndpoint}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        "Unable to obtain a CSRF token. Please try again.",
        response.status,
      );
    }

    const payload = (await response.json()) as CsrfTokenResponse;

    if (
      typeof payload.message !== "string" ||
      payload.message.length === 0
    ) {
      throw new Error("Frappe returned an invalid CSRF token response.");
    }

    // An older in-flight request must not overwrite a newer session's token.
    if (generation === csrfGeneration) {
      csrfToken = payload.message;
    }

    return payload.message;
  })();

  csrfTokenRequest = request;

  try {
    return await request;
  } finally {
    if (csrfTokenRequest === request) {
      csrfTokenRequest = null;
    }
  }
}

export async function refreshCsrfToken(): Promise<void> {
  await fetchCsrfToken(true);
}

export function clearCsrfToken(): void {
  csrfGeneration += 1;
  csrfToken = null;
  csrfTokenRequest = null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? "GET").toUpperCase();

  headers.set("Accept", "application/json");

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = await fetchCsrfToken();
    headers.set("X-Frappe-CSRF-Token", token);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let payload: unknown;

  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const body = payload as
      | {
          exception?: string;
          message?: string;
          _server_messages?: string;
        }
      | undefined;

    let message =
      body?.message ??
      body?.exception ??
      `Request failed (${response.status})`;

    if (body?._server_messages) {
      try {
        const messages = JSON.parse(body._server_messages) as string[];
        const first = messages[0];

        if (first) {
          const parsed = JSON.parse(first) as { message?: string };
          message = parsed.message ?? message;
        }
      } catch {
        // Preserve the original error if Frappe's format differs.
      }
    }

    throw new ApiError(message, response.status);
  }

  return payload as T;
}
