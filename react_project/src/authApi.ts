const API_BASE = "https://django-backend-1098462988032.europe-west1.run.app";

export interface User {
  username: string;
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export async function initCsrf(): Promise<void> {
  await fetch(`${API_BASE}/api/auth/csrf/`, {
    credentials: "include",
  });
}

export async function login(
  username: string,
  password: string
): Promise<User> {
  const csrfToken = getCookie("csrftoken");

  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).detail || "Login failed");
  }

  return res.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/api/auth/me/`, {
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}

export async function logout(): Promise<void> {
  const csrfToken = getCookie("csrftoken");

  await fetch(`${API_BASE}/api/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken || "",
    },
  });
}
