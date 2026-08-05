import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractStatusCode(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status: number }).status;
  }
  return 500;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    if ("message" in errorObj && typeof errorObj.message === "string") {
      return errorObj.message;
    }

    if ("detail" in errorObj) {
      const detail = errorObj.detail;
      if (typeof detail === "string") return detail;

      if (Array.isArray(detail) && detail.length > 0) {
        return detail
          .map((d: unknown) => {
            if (typeof d === "object" && d !== null) {
              const dObj = d as Record<string, unknown>;
              if ("msg" in dObj && typeof dObj.msg === "string") {
                return dObj.msg;
              }
            }
            return "";
          })
          .filter(Boolean)
          .join(", ");
      }
    }
  }

  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}
