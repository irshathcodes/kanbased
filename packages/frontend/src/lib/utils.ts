import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useBetterParams<TParams extends Record<string, any>>() {
  return {};
}

export function getId() {
  return crypto.randomUUID();
}

export async function promiseTimeout(delayInMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMs);
  });
}

export async function fetchAndCacheImage(
  cacheName: string,
  imageUrl: string,
): Promise<string | null> {
  const cache = await caches.open(cacheName);

  // Check if the image is already cached
  const cachedResponse = await cache.match(imageUrl);

  if (cachedResponse) {
    const res = await cachedResponse.blob();
    return URL.createObjectURL(res);
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();

    cache.put(imageUrl, response.clone());
    return URL.createObjectURL(blob);
  } catch (err) {
    return null;
  }
}

export interface AuthErrorType {
  code?: string;
  message?: string;
  status: number;
  statusText: string;
}

export function handleAuthResponse<T>(response: {
  data: T;
  error: AuthErrorType | null;
}): T {
  if (response.error) {
    throw new AuthError(response.error);
  }

  return response.data;
}

export class UserViewableError {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export class AuthError extends Error {
  error: AuthErrorType;

  constructor(error: AuthErrorType) {
    super(error.message);
    this.error = error;
  }
}

export function getSidebarStateFromCookie(): boolean {
  const cookies = document.cookie.split(";");
  const sidebarCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("sidebar:state="),
  );
  return sidebarCookie ? sidebarCookie.split("=")[1] === "true" : false;
}


// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}