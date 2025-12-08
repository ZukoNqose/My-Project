export const API_BASE_URL = "http://localhost:5146/api"; // Use HTTP backend for local dev

export async function registerUser(user) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }

  return res.json();
}

export async function loginUser(user) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }

  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("HTTP error " + res.status);
  return res.json();
}
