"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  Users,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      title: "Manajemen Inventaris",
      description: "Kelola stok komponen elektronik dengan struktur data yang rapi, status real-time, dan pencarian yang cepat.",
      image: "/feature-inventory.svg",
    },
    {
      title: "Notifikasi Stok",
      description: "Dapatkan pengingat saat stok mulai menipis agar pengadaan barang tidak terlambat.",
      image: "/feature-alert.svg",
    },
    {
      title: "Multi-User Access",
      description: "Atur hak akses Admin, Staff Gudang, dan Manager sesuai kebutuhan operasional masing-masing.",
      image: "/feature-users.svg",
    },
    {
      title: "Backup & Security",
      description: "Simpan data inventaris dengan aman dan siapkan cadangan agar aktivitas gudang tetap terjaga.",
      image: "/feature-security.svg",
    },
  ];

  const roles = [
    {
      title: "Admin",
      description: "Akses penuh ke semua fitur sistem",
      features: ["Kelola Data Master", "Manajemen User", "Backup Data", "Full Report Access"],
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Staff Gudang",
      description: "Fokus operasional barang masuk dan keluar",
      features: ["Input Transaksi", "Pencarian Barang", "Notifikasi Stok", "Stock Management"],
      color: "from-green-500 to-green-600",
    },
    {
      title: "Manager",
      description: "Monitoring dan laporan eksekutif",
      features: ["Lihat Dashboard", "Export Laporan", "Analisis Stok", "View Reports"],
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-lg shadow-sm">
                <Package className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl text-[#0C447C] font-semibold">ElectroStock</span>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2.5 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition-all hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0C447C] via-[#378ADD] to-[#0C447C] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute -top-12 right-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">Sistem Inventaris Terpercaya</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Kelola Inventaris
                <br />
                Komponen Elektronik
                <br />
                Lebih Mudah
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Solusi manajemen stok yang ringkas, jelas, dan mudah dipakai untuk membantu gudang bekerja lebih cepat dan terorganisir.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-[#378ADD] rounded-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold"
                >
                  Mulai Sekarang
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-blue-100/90">Operasional</p>
                  <p className="text-lg font-semibold">Stok, transaksi, dan akses role dalam satu sistem</p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="relative mx-auto w-full max-w-2xl">
                <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2">
                  <div className="relative h-[460px] w-full overflow-hidden rounded-[1.5rem]">
                    <Image
                      src="/foto.jpg"
                      alt="Visual dashboard ElectroStock"
                      fill
                      priority
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0C447C]/25 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0C447C] mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola inventaris komponen elektronik secara profesional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#0C447C] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0C447C] mb-4">Akses Berdasarkan Role</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setiap user mendapat akses sesuai kebutuhan dan tanggung jawab masing-masing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#378ADD] transition-all hover:shadow-xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-6`}>
                  {role.title === "Admin" ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : role.title === "Staff Gudang" ? (
                    <Package className="w-8 h-8 text-white" />
                  ) : (
                    <Users className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#0C447C] mb-2">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <ul className="space-y-3">
                  {role.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#378ADD] to-[#0C447C]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Siap Meningkatkan Efisiensi Gudang Anda?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Gunakan ElectroStock untuk mengatur data inventaris, transaksi barang, dan akses user dalam satu alur kerja yang rapi.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-white text-[#378ADD] rounded-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-lg"
          >
            Akses Sistem Sekarang
          </button>
        </div>
      </section>

      <footer className="bg-[#0C447C] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Package className="w-8 h-8" />
              <span className="text-xl font-semibold">ElectroStock</span>
            </div>
            <p className="text-blue-200">Copyright 2026 ElectroStock. Sistem Manajemen Inventaris Elektronik.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
