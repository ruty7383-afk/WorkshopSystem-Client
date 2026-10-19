export function getToken() {
  return localStorage.getItem("token");
}

export function getTokenPayload() {
  const token = getToken();

  if (!token) return null;

  try {
    const part = token.split(".")[1];
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getRole() {
  const payload = getTokenPayload();

  if (!payload) return null;

  return (
    payload.role ??
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ??
    null
  );
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-changed"));
}
