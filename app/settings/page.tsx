"use client";

import { useState, useEffect } from "react";
import { Database, Bell, Shield, User, Download, Upload } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useAuthContext } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";

export default function Settings() {
  const { user, setUser } = useAuthContext();

  // Profile state
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileMsg,  setProfileMsg]  = useState("");
  const [profileError,setProfileError]= useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg,   setPasswordMsg]   = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Isi form dari data user yang sudah login
  useEffect(() => {
    if (user) {
      setName(user.name   || "");
      setEmail(user.email || "");
      setPhone((user as any).phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setProfileLoading(true);

    try {
      const response = await apiClient.put("/profile", { name, email, phone });
      if (response.status) {
        setProfileMsg("Profil berhasil diupdate.");
        // Update data user di localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        setProfileError(response.message || "Gagal mengupdate profil.");
      }
    } catch {
      setProfileError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await apiClient.put("/profile/password", {
        current_password:      currentPassword,
        new_password:          newPassword,
        new_password_confirmation: confirmPassword,
      });

      if (response.status) {
        setPasswordMsg("Password berhasil diubah.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(response.message || "Gagal mengubah password.");
      }
    } catch (err: any) {
      setPasswordError(
        err?.errors?.current_password?.[0] ||
        err?.message ||
        "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

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
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
              </div>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
              </div>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">No. Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                />
              </div>
            </div>
            {profileMsg   && <p className="text-green-600 text-sm">{profileMsg}</p>}
            {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium disabled:opacity-70"
            >
              {profileLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#378ADD]" />
            <h3 className="text-xl font-bold text-[#0C447C]">Keamanan</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block mb-2 text-[#0C447C] font-medium">Password Lama</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                placeholder="Masukkan password lama"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  placeholder="Konfirmasi password baru"
                />
              </div>
            </div>
            {passwordMsg   && <p className="text-green-600 text-sm">{passwordMsg}</p>}
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-lg transition font-medium disabled:opacity-70"
            >
              {passwordLoading ? "Memproses..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        {(user?.role === "admin" || user?.role === "staff") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#378ADD]" />
              <h3 className="text-xl font-bold text-[#0C447C]">Notifikasi</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Notifikasi Stok Menipis", desc: "Terima notifikasi saat stok mendekati minimum", defaultChecked: true },
                { label: "Notifikasi Transaksi",    desc: "Terima notifikasi untuk setiap transaksi",     defaultChecked: true },
                { label: "Email Notifikasi",        desc: "Kirim notifikasi via email",                   defaultChecked: false },
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
        {user?.role === "admin" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-[#378ADD]" />
              <h3 className="text-xl font-bold text-[#0C447C]">Backup Data</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Backup data inventaris Anda secara berkala untuk mencegah kehilangan data.
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
        {user?.role === "admin" && (
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