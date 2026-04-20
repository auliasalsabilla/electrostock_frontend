"use client";

import { useState } from "react";
import { Package, Users, MapPin, Search, Plus, Edit2, Trash2, FolderPlus } from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface Barang {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  stok: number;
  satuan: string;
  lokasi: string;
}

interface Supplier {
  id: number;
  nama: string;
  kontak: string;
  email: string;
  alamat: string;
}

interface Lokasi {
  id: number;
  kode: string;
  nama: string;
  kapasitas: string;
  terisi: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

export default function DataMaster() {
  const [activeTab, setActiveTab] = useState<string>("barang");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([
    "Resistor", "Kapasitor", "LED", "IC", "Transistor", "Sensor",
  ]);
  const [newCategory, setNewCategory] = useState<string>("");

  const barangData: Barang[] = [
    { id: 1, kode: "RES-001", nama: "Resistor 10K Ohm", kategori: "Resistor", stok: 1200, satuan: "Pcs", lokasi: "Rak A1" },
    { id: 2, kode: "CAP-001", nama: "Kapasitor 100uF", kategori: "Kapasitor", stok: 450, satuan: "Pcs", lokasi: "Rak A2" },
    { id: 3, kode: "LED-001", nama: "LED Merah 5mm", kategori: "LED", stok: 2200, satuan: "Pcs", lokasi: "Rak B1" },
    { id: 4, kode: "IC-001", nama: "IC 555 Timer", kategori: "IC", stok: 320, satuan: "Pcs", lokasi: "Rak C1" },
    { id: 5, kode: "TRN-001", nama: "Transistor NPN", kategori: "Transistor", stok: 180, satuan: "Pcs", lokasi: "Rak C2" },
  ];

  const supplierData: Supplier[] = [
    { id: 1, nama: "PT Elektronika Jaya", kontak: "021-12345678", email: "info@elektronika.com", alamat: "Jakarta" },
    { id: 2, nama: "CV Komponen Nusantara", kontak: "022-87654321", email: "sales@komponen.com", alamat: "Bandung" },
    { id: 3, nama: "UD Maju Sejahtera", kontak: "031-11223344", email: "ud.maju@mail.com", alamat: "Surabaya" },
  ];

  const lokasiData: Lokasi[] = [
    { id: 1, kode: "A1", nama: "Rak A1", kapasitas: "100 Box", terisi: "75 Box" },
    { id: 2, kode: "A2", nama: "Rak A2", kapasitas: "100 Box", terisi: "60 Box" },
    { id: 3, kode: "B1", nama: "Rak B1", kapasitas: "150 Box", terisi: "120 Box" },
    { id: 4, kode: "C1", nama: "Rak C1", kapasitas: "120 Box", terisi: "90 Box" },
  ];

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  const filteredBarang = barangData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || item.kategori === selectedCategory;
    return matchSearch && matchCategory;
  });

  const tabs: Tab[] = [
    { id: "barang", label: "Barang", icon: Package },
    { id: "supplier", label: "Supplier", icon: Users },
    { id: "lokasi", label: "Lokasi", icon: MapPin },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(""); setSelectedCategory("all"); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Cari ${activeTab}...`}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent"
              />
            </div>
            {activeTab === "barang" && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent min-w-[200px]"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Tambah {activeTab === "barang" ? "Barang" : activeTab === "supplier" ? "Supplier" : "Lokasi"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "barang" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kode</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama Barang</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Stok</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Lokasi</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBarang.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{item.kode}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{item.nama}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.stok} {item.satuan}</td>
                      <td className="px-6 py-4 text-gray-600">{item.lokasi}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "supplier" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama Supplier</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kontak</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Alamat</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{supplier.nama}</td>
                      <td className="px-6 py-4 text-gray-600">{supplier.kontak}</td>
                      <td className="px-6 py-4 text-gray-600">{supplier.email}</td>
                      <td className="px-6 py-4 text-gray-600">{supplier.alamat}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "lokasi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lokasiData.map((lokasi) => (
                <div key={lokasi.id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#378ADD] hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0C447C] mb-1">{lokasi.nama}</h3>
                  <p className="text-gray-600 mb-4">Kode: {lokasi.kode}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kapasitas</span>
                      <span className="font-semibold text-[#0C447C]">{lokasi.kapasitas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Terisi</span>
                      <span className="font-semibold text-[#378ADD]">{lokasi.terisi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#0C447C] mb-6">
                Tambah {activeTab === "barang" ? "Barang" : activeTab === "supplier" ? "Supplier" : "Lokasi"}
              </h2>

              {activeTab === "barang" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Kode Barang</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: RES-001" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Nama Barang</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Nama barang" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Kategori</label>
                    <div className="flex gap-2">
                      <select className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium"
                      >
                        <FolderPlus className="w-5 h-5" />
                        Tambah Kategori
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Stok Awal</label>
                      <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="0" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Satuan</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                        <option>Pcs</option>
                        <option>Box</option>
                        <option>Unit</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Lokasi</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                      <option value="">Pilih Lokasi</option>
                      {lokasiData.map((lok) => (
                        <option key={lok.id} value={lok.kode}>{lok.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "supplier" && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Nama Supplier</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: PT Elektronika Jaya" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Kontak</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="021-12345678" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Email</label>
                      <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="email@supplier.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Alamat</label>
                    <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Alamat lengkap supplier"></textarea>
                  </div>
                </div>
              )}

              {activeTab === "lokasi" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Kode Lokasi</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: A1" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Nama Lokasi</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: Rak A1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Kapasitas</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: 100 Box" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Terisi</label>
                      <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Contoh: 0 Box" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                  Batal
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-medium">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-xl font-bold text-[#0C447C] mb-6">Tambah Kategori Baru</h3>
              <div>
                <label className="block mb-2 text-[#0C447C] font-medium">Nama Kategori</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                  placeholder="Contoh: Dioda"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => { setShowCategoryModal(false); setNewCategory(""); }} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                  Batal
                </button>
                <button onClick={handleAddCategory} className="flex-1 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-medium">
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
