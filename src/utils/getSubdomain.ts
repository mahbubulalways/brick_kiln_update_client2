export const getSubdomain = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const hostname = window.location.hostname;

  // Local development
  // sabbbir.localhost
  if (hostname.endsWith(".localhost")) {
    return hostname.replace(".localhost", "");
  }

  // Production
  // sabbbir.itvata.com
  if (hostname.endsWith(".itvata.com")) {
    return hostname.replace(".itvata.com", "");
  }

  // Main domain
  // itvata.com
  return null;
};