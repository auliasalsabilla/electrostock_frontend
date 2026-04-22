"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Mail, Lock, Shield, Check } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("admin");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login gagal. Silakan coba lagi.");
        return;
      }

      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);
      router.push("/dashboard");
    } catch {
      setErrorMessage("Terjadi gangguan saat menghubungi server login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0C447C] via-[#378ADD] to-[#0C447C] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Package className="w-10 h-10 text-white" />
            </div>
            <span className="text-3xl text-white font-semibold">ElectroStock</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Sistem Manajemen
            <br />
            Inventaris Elektronik
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-md leading-relaxed">
            Kelola stok komponen elektronik dengan lebih efisien, lebih rapi, dan lebih terorganisir.
          </p>
          <div className="space-y-4">
            {[
              "Kelola stok barang dalam satu sistem",
              "Akses role sesuai kebutuhan tim",
              "Riwayat transaksi lebih mudah dipantau",
              "Notifikasi stok menipis lebih cepat",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-blue-100 text-sm">
          Copyright 2026 ElectroStock. All rights reserved.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl text-[#0C447C] font-semibold">ElectroStock</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0C447C] mb-2">Selamat Datang!</h2>
            <p className="text-gray-600">Silakan login untuk melanjutkan ke sistem</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="role" className="block mb-2 text-[#0C447C] font-medium">Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent bg-white transition"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff Gudang</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-[#0C447C] font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-[#0C447C] font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Memproses Login..." : "Login Sekarang"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-[#378ADD] hover:text-[#0C447C] transition font-medium"
              >
                Kembali ke Landing Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
