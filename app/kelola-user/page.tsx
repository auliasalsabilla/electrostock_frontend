"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Search, Mail, Shield, Eye, EyeOff } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { apiClient } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

export default function KelolaUser() {
  const [users, setUsers]             = useState<User[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [isEdit, setIsEdit]           = useState(false);
  const [editId, setEditId]           = useState<number | null>(null);
  const [searchTerm, setSearchTerm]   = useState("");
  const [error, setError]             = useState("");
  const [formError, setFormError]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]       = useState<FormData>({
    name: "", email: "", password: "", role: "staff", is_active: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users");
      if (response.status) setUsers(response.data);
    } catch {
      setError("Gagal memuat data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    setFormError("");
    setShowPassword(false);
    if (user) {
      setIsEdit(true);
      setEditId(user.id);
      setFormData({
        name: user.name, email: user.email, password: "",
        role: user.role, is_active: user.is_active,
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({ name: "", email: "", password: "", role: "staff", is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      if (isEdit && editId) {
        const payload: any = {
          name: formData.name, email: formData.email,
          role: formData.role, is_active: formData.is_active,
        };
        if (formData.password) payload.password = formData.password;

        const response = await apiClient.put(`/users/${editId}`, payload);
        if (response.status) {
          await fetchUsers();
          setShowModal(false);
        } else {
          setFormError(response.message || "Gagal mengupdate user.");
        }
      } else {
        const response = await apiClient.post("/users", formData);
        if (response.status) {
          await fetchUsers();
          setShowModal(false);
        } else {
          setFormError(response.message || "Gagal menambah user.");
        }
      }
    } catch (err: any) {
      const errors = err?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        setFormError(firstError[0]);
      } else {
        setFormError(err?.message || "Terjadi kesalahan.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
    try {
      const response = await apiClient.delete(`/users/${id}`);
      if (response.status) await fetchUsers();
    } catch {
      alert("Gagal menghapus user.");
    }
  };

  const getRoleBadge = (role: string): string => {
    const badges: Record<string, string> = {
      admin:   "bg-blue-100 text-blue-700",
      manager: "bg-purple-100 text-purple-700",
      staff:   "bg-green-100 text-green-700",
    };
    return badges[role] || badges.staff;
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      admin:   "Admin",
      manager: "Manager",
      staff:   "Staff Gudang",
    };
    return labels[role] || role;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#378ADD]" />
            <h1 className="text-3xl font-bold text-[#0C447C]">Manajemen User</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Tambah User
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari user berdasarkan nama atau email..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Memuat data...</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">No</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-8">
                        Tidak ada user ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-[#0C447C] font-medium">{user.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getRoleBadge(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                            user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {user.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-[#0C447C] mb-6">
                {isEdit ? "Edit User" : "Tambah User Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">
                    Password {isEdit && <span className="text-gray-400 text-sm">(kosongkan jika tidak diubah)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                      required={!isEdit}
                      placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff Gudang</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Status</label>
                  <select
                    value={formData.is_active ? "aktif" : "nonaktif"}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "aktif" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
                {formError && <p className="text-red-600 text-sm">{formError}</p>}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-semibold"
                  >
                    {isEdit ? "Simpan" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}