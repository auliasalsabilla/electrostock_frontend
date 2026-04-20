"use client";

import { useState } from "react";
import { Users, Plus, Edit2, Trash2, Search, Mail, Shield } from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  status: string;
}

export default function KelolaUser() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<User>({
    id: 0,
    nama: "",
    email: "",
    role: "staff",
    status: "aktif",
  });

  const [users, setUsers] = useState<User[]>([
    { id: 1, nama: "Admin Utama", email: "admin@electrostock.com", role: "admin", status: "aktif" },
    { id: 2, nama: "Budi Santoso", email: "staff@electrostock.com", role: "staff", status: "aktif" },
    { id: 3, nama: "Siti Rahayu", email: "manager@electrostock.com", role: "manager", status: "aktif" },
    { id: 4, nama: "Ahmad Wijaya", email: "ahmad@electrostock.com", role: "staff", status: "nonaktif" },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setIsEdit(true);
      setFormData(user);
    } else {
      setIsEdit(false);
      setFormData({ id: 0, nama: "", email: "", role: "staff", status: "aktif" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      setUsers(users.map((u) => (u.id === formData.id ? formData : u)));
    } else {
      setUsers([...users, { ...formData, id: users.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getRoleBadge = (role: string): string => {
    const badges: Record<string, string> = {
      admin: "bg-blue-100 text-blue-700",
      manager: "bg-purple-100 text-purple-700",
      staff: "bg-green-100 text-green-700",
    };
    return badges[role] || badges.staff;
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      admin: "Admin",
      manager: "Manager",
      staff: "Staff Gudang",
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

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="overflow-x-auto">
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
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-[#378ADD] to-[#0C447C] text-white rounded-xl flex items-center justify-center font-semibold shadow-md">
                          {user.nama.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[#0C447C] font-medium">{user.nama}</span>
                      </div>
                    </td>
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
                        user.status === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                ))}
              </tbody>
            </table>
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
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
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
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
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
