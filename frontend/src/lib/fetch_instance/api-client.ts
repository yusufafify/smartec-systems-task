import { extractErrorMessage, extractStatusCode } from "@/lib/utils";

type Method = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: Record<string, string>;
}

export class HTTPError extends Error {
  public status: number;
  public statusText: string;
  public data?: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    const extractedMessage =
      data !== null && data !== undefined ? extractErrorMessage(data) : "";

    super(extractedMessage || `HTTP Error ${status}: ${statusText}`);
    this.name = "UnifiedHTTPError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export class APIClient {
  private baseURL: string;
  private getAuthToken: () => Promise<string | null>;
  private getLanguage: () => Promise<string>;

  constructor(
    baseURL: string = import.meta.env.VITE_API_URL || "",
    getAuthToken: () => Promise<string | null> = () => Promise.resolve(null),
    getLanguage: () => Promise<string> = () => Promise.resolve("en"),
  ) {
    this.baseURL = baseURL;
    this.getAuthToken = getAuthToken;
    this.getLanguage = getLanguage;
  }

  get<T>(path: string, opts: RequestOptions = {}) {
    return this.request<T>("GET", path, opts);
  }
  post<T>(path: string, opts: RequestOptions = {}) {
    return this.request<T>("POST", path, opts);
  }
  patch<T>(path: string, opts: RequestOptions = {}) {
    return this.request<T>("PATCH", path, opts);
  }
  put<T>(path: string, opts: RequestOptions = {}) {
    return this.request<T>("PUT", path, opts);
  }
  delete<T>(path: string, opts: RequestOptions = {}) {
    return this.request<T>("DELETE", path, opts);
  }

  private async request<T>(
    method: Method,
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(
      path.startsWith("http")
        ? path
        : `${this.baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
    );

    if (opts.params) {
      Object.entries(opts.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }

    const token = await this.getAuthToken();
    const language = await this.getLanguage();

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Language": language,
      ...(opts.headers || {}),
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    let body: BodyInit | undefined;

    if (opts.data !== undefined && method !== "GET") {
      const isFormData =
        typeof FormData !== "undefined" && opts.data instanceof FormData;

      if (isFormData) {
        delete headers["Content-Type"];
        body = opts.data as FormData;
      } else {
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
        body =
          headers["Content-Type"] === "application/json"
            ? JSON.stringify(opts.data)
            : (opts.data as string);
      }
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body,
      credentials: "include",
      cache: import.meta.env.DEV ? "no-store" : "default",
    });

    const ct = res.headers.get("content-type") || "";
    const parsed = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text();

    if (!res.ok) {
      const status =
        extractStatusCode(parsed) !== 500
          ? extractStatusCode(parsed)
          : res.status;
      throw new HTTPError(status, res.statusText, parsed);
    }

    return parsed as T;
  }
}

// Export a default instance for easy imports
export const api = new APIClient();
