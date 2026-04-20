"use client";

import { useState, useEffect } from "react";
import { Database, Bell, Shield, User, Download, Upload } from "lucide-react";
import MainLayout from "@/components/MainLayout";

export default function Settings() {
  const [userRole, setUserRole] = useState<string>("admin");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  const handleBackup = () => {
    alert("Backup data dimulai... File akan diunduh segera.");
  };

  const handleRestore = () => {
    alert("Pilih file backup untuk restore data.");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#378ADD]" />
            <h3 className="text-xl font-bold text-[#0C447C]">Profil Pengguna</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
              </div>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Email</label>
                <input
                  type="email"
                  defaultValue="admin@electrostock.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
              </div>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium">
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#378ADD]" />
            <h3 className="text-xl font-bold text-[#0C447C]">Keamanan</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-[#0C447C] font-medium">Password Lama</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                placeholder="Masukkan password lama"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Password Baru</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Konfirmasi Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  placeholder="Konfirmasi password baru"
                />
              </div>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        {(userRole === "admin" || userRole === "staff") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#378ADD]" />
              <h3 className="text-xl font-bold text-[#0C447C]">Notifikasi</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Notifikasi Stok Menipis", desc: "Terima notifikasi saat stok mendekati minimum", defaultChecked: true },
                { label: "Notifikasi Transaksi", desc: "Terima notifikasi untuk setiap transaksi", defaultChecked: true },
                { label: "Email Notifikasi", desc: "Kirim notifikasi via email", defaultChecked: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-[#0C447C] font-medium">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input type="checkbox" className="peer sr-only" defaultChecked={item.defaultChecked} />
                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#378ADD] transition"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backup & Restore - Admin Only */}
        {userRole === "admin" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-[#378ADD]" />
              <h3 className="text-xl font-bold text-[#0C447C]">Backup Data</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Backup data inventaris Anda secara berkala untuk mencegah kehilangan data. Terakhir backup:{" "}
                <span className="text-[#0C447C] font-medium">28 Maret 2026, 14:30 WIB</span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleBackup}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium"
                >
                  <Download className="w-5 h-5" />
                  Backup Data Sekarang
                </button>
                <button
                  onClick={handleRestore}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-[#378ADD] text-[#378ADD] rounded-xl hover:bg-[#378ADD] hover:text-white transition font-medium"
                >
                  <Upload className="w-5 h-5" />
                  Restore Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Settings - Admin Only */}
        {userRole === "admin" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#0C447C] mb-6">Pengaturan Sistem</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Minimum Stok Alert</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Sistem akan memberi peringatan jika stok di bawah nilai ini
                </p>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium">
                Simpan Pengaturan
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
