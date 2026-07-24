import axios from 'axios';

// In development the base URL is empty and Vite proxies "/api" to the server.
// In production set VITE_API_URL to the deployed API origin.
const baseURL = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export interface ApiFieldError {
  field: string;
  message: string;
}

/** Pulls a human-friendly message (and any field errors) out of an axios error. */
export function parseApiError(error: unknown): {
  message: string;
  fieldErrors: ApiFieldError[];
} {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; details?: ApiFieldError[] }
      | undefined;
    return {
      message: data?.message ?? 'Network error — please try again',
      fieldErrors: data?.details ?? [],
    };
  }
  return { message: 'Something went wrong', fieldErrors: [] };
}
