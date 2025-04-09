export function getOrigin() {
  // TODO: Revisit this if we are doing SSR.
  const origin = window.location.origin;

  // Remove trailing slash from origin if it exists.
  if (origin[origin.length - 1] === "/") {
    return origin.slice(0, -1);
  }

  return origin;
}

export const isMac =
  typeof window !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;

let sessionLoaded = false;

export function setSessionLoaded() {
  if (!window) {
    sessionLoaded = false;
    return;
  }

  sessionLoaded = true;
}

export function isSessionLoaded() {
  return sessionLoaded;
}
