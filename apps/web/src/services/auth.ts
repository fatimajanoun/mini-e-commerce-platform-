export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

const API_URL = "http://localhost:3000";

export async function login(data: LoginData): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Invalid email or password");
  }

  return result.user;
}

export async function getMe(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  const result = await response.json();

  return result.user;
}