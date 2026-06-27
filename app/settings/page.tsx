"use client";

import { useState, useEffect } from "react";
import { Shield, User } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useAuthContext } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";

export default function Settings() {
  const { user } = useAuthContext();

  // Profile state
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileMsg,     setProfileMsg]     = useState("");
  const [profileError,   setProfileError]   = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg,     setPasswordMsg]     = useState("");
  const [passwordError,   setPasswordError]   = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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
        current_password:          currentPassword,
        new_password:              newPassword,
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

      </div>
    </MainLayout>
  );
}
