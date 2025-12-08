const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5001";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/productsapi`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_URL}/Identity/Account/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  return res.ok;
}

export async function register(data) {
  const res = await fetch(`${API_URL}/Identity/Account/Register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
  return res.ok;
}
