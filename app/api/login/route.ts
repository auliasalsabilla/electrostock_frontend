import { NextRequest, NextResponse } from "next/server";

const backendUrls = [
  "http://127.0.0.1:8000/api/login",
  "http://localhost:8000/api/login",
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
          { message: data.message || "Login gagal." },
          { status: response.status }
        );
      }

      // Kembalikan token + data user ke frontend
      return NextResponse.json({
        status: true,
        email: data.data?.user?.email,
        role: data.data?.user?.role,
        name: data.data?.user?.name,
        access_token: data.data?.access_token,
      });

    } catch {
      continue;
    }
  }

  return NextResponse.json(
    { message: "Tidak dapat terhubung ke server backend. Pastikan php artisan serve sedang berjalan." },
    { status: 503 }
  );
}