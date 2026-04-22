import { NextRequest, NextResponse } from "next/server";

const backendUrls = [
  "http://127.0.0.1:8000/api/login",
  "http://localhost:8000/api/login",
  "http://127.0.0.1/electrostock_backend/public/api/login",
  "http://localhost/electrostock_backend/public/api/login",
];

const fallbackUsers = [
  { email: "admin@gmail.com", password: "admin123", role: "admin" },
  { email: "staff@gmail.com", password: "staff123", role: "staff" },
  { email: "manager@gmail.com", password: "manager123", role: "manager" },
  { email: "admin@electrostock.com", password: "admin123", role: "admin" },
  { email: "staff@electrostock.com", password: "staff123", role: "staff" },
  { email: "manager@electrostock.com", password: "manager123", role: "manager" },
];

export async function POST(request: NextRequest) {
  const body = await request.json();

  for (const url of backendUrls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || "Login gagal. Periksa email, password, dan role Anda." },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } catch {
      continue;
    }
  }

  const matchedUser = fallbackUsers.find(
    (user) =>
      user.email.toLowerCase() === String(body.email || "").toLowerCase() &&
      user.password === body.password &&
      user.role === body.role
  );

  if (matchedUser) {
    return NextResponse.json({
      email: matchedUser.email,
      role: matchedUser.role,
      source: "fallback",
    });
  }

  return NextResponse.json(
    {
      message:
        "Login gagal. Periksa email, password, dan role Anda. Jika ingin memakai backend Laravel, pastikan server backend aktif.",
    },
    { status: 401 }
  );
}
