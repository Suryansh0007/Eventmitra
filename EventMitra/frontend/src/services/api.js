const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("eventmitra_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("eventmitra_token", token);
}

export function clearToken() {
  localStorage.removeItem("eventmitra_token");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 204) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

export function post(path, body) {
  return apiRequest(path, { method: "POST", body: JSON.stringify(body) });
}

export function put(path, body) {
  return apiRequest(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
}

export function del(path) {
  return apiRequest(path, { method: "DELETE" });
}

export { API_BASE };
