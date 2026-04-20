"use client";

import { useRouter } from "next/navigation";
import {
  Package,
  BarChart3,
  Users,
  Shield,
  TrendingUp,
  Bell,
  ChevronRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Package,
      title: "Manajemen Inventaris",
      description: "Kelola stok barang elektronik dengan sistem yang terorganisir dan real-time",
    },
    {
      icon: TrendingUp,
      title: "Tracking Transaksi",
      description: "Monitor barang masuk dan keluar dengan histori lengkap dan detail",
    },
    {
      icon: Bell,
      title: "Notifikasi Stok",
      description: "Dapatkan alert otomatis ketika stok mencapai batas minimum",
    },
    {
      icon: BarChart3,
      title: "Laporan & Analitik",
      description: "Visualisasi data dengan chart interaktif dan export ke PDF/Excel",
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Role-based access untuk Admin, Staff Gudang, dan Manager",
    },
    {
      icon: Shield,
      title: "Backup & Security",
      description: "Backup data otomatis dan restore untuk keamanan maksimal",
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
      description: "Fokus operasional transaksi",
      features: ["Input Transaksi", "Pencarian Barang", "Notifikasi Stok", "Stock Management"],
      color: "from-green-500 to-green-600",
    },
    {
      title: "Manager",
      description: "Monitoring dan laporan eksekutif",
      features: ["Lihat Dashboard", "Export Laporan", "Analisis Stok", "View Reports"],
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-lg">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#0C447C] via-[#378ADD] to-[#0C447C] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
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
              Solusi manajemen stok yang powerful dan user-friendly untuk meningkatkan efisiensi operasional gudang Anda
            </p>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#378ADD] rounded-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold"
            >
              Mulai Sekarang
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0C447C] mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola inventaris komponen elektronik secara profesional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0C447C] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0C447C] mb-4">Akses Berdasarkan Role</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setiap user mendapat akses sesuai kebutuhan dan tanggung jawab masing-masing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#378ADD] transition-all hover:shadow-xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Shield className="w-8 h-8 text-white" />
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#378ADD] to-[#0C447C]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Siap Meningkatkan Efisiensi Gudang Anda?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan perusahaan yang telah mempercayai ElectroStock untuk mengelola inventaris mereka
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-white text-[#378ADD] rounded-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-lg"
          >
            Akses Sistem Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C447C] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Package className="w-8 h-8" />
              <span className="text-xl font-semibold">ElectroStock</span>
            </div>
            <p className="text-blue-200">© 2026 ElectroStock. Sistem Manajemen Inventaris Profesional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
