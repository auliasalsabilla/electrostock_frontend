"use client";

import { useState, useEffect, useRef } from "react";
import { Package, Users, MapPin, Search, Plus, Edit2, Trash2, FolderPlus, ImageIcon } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { apiClient } from "@/lib/api";

interface Barang {
  id: number;
  code: string;
  name: string;
  brand: string;
  category_id: number | null;
  supplier_id: number | null;
  unit_id: number | null;
  storage_location_id: number | null;
  stock: number;
  stock_minimum: number;
  purchase_price: number;
  is_active: boolean;
  image: string | null;
  image_url: string | null;
  category: { id: number; name: string } | null;
  supplier: { id: number; name: string } | null;
  unit: { id: number; name: string; abbreviation: string } | null;
  storage_location: { id: number; name: string } | null;
}

interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  is_active: boolean;
}

interface Lokasi {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

export default function DataMaster() {
  const [activeTab, setActiveTab]       = useState("barang");
  const [searchTerm, setSearchTerm]     = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEdit, setIsEdit]             = useState(false);
  const [editId, setEditId]             = useState<number | null>(null);
  const [loading, setLoading]           = useState(false);
  const [formError, setFormError]       = useState("");

  const [barangList,   setBarangList]   = useState<Barang[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [lokasiList,   setLokasiList]   = useState<Lokasi[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [unitList,     setUnitList]     = useState<Unit[]>([]);

  const [barangForm, setBarangForm] = useState({
    code: "", name: "", brand: "", description: "",
    category_id: "", supplier_id: "", unit_id: "", storage_location_id: "",
    stock: 0, stock_minimum: 0, purchase_price: 0, is_active: true,
  });

  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const [supplierForm, setSupplierForm] = useState({
    code: "", name: "", contact_person: "", phone: "",
    email: "", address: "", city: "", is_active: true,
  });

  const [lokasiForm, setLokasiForm] = useState({
    code: "", name: "", description: "", is_active: true,
  });

  const [categoryForm, setCategoryForm] = useState({ name: "" });

  const fetchBarang   = async () => { const r = await apiClient.get("/items");             if (r.status) setBarangList(r.data); };
  const fetchSupplier = async () => { const r = await apiClient.get("/suppliers");          if (r.status) setSupplierList(r.data); };
  const fetchLokasi   = async () => { const r = await apiClient.get("/storage-locations");  if (r.status) setLokasiList(r.data); };
  const fetchCategory = async () => { const r = await apiClient.get("/categories");         if (r.status) setCategoryList(r.data); };
  const fetchUnit     = async () => { const r = await apiClient.get("/units");              if (r.status) setUnitList(r.data); };

  useEffect(() => {
    fetchBarang(); fetchSupplier(); fetchLokasi(); fetchCategory(); fetchUnit();
  }, []);

  const filteredBarang = barangList.filter(
    (i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           i.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSupplier = supplierList.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredLokasi = lokasiList.filter(
    (l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenModal = (item?: any) => {
    setFormError("");
    setImageFile(null);
    setImagePreview(null);
    if (item) {
      setIsEdit(true);
      setEditId(item.id);
      if (activeTab === "barang") {
        setBarangForm({
          code: item.code, name: item.name, brand: item.brand || "",
          description: item.description || "",
          category_id: item.category_id || "",
          supplier_id: item.supplier_id || "",
          unit_id: item.unit_id || "",
          storage_location_id: item.storage_location_id || "",
          stock: item.stock, stock_minimum: item.stock_minimum,
          purchase_price: item.purchase_price,
          is_active: item.is_active,
        });
        if (item.image_url) setImagePreview(item.image_url);
      } else if (activeTab === "supplier") {
        setSupplierForm({
          code: item.code, name: item.name,
          contact_person: item.contact_person || "",
          phone: item.phone || "", email: item.email || "",
          address: item.address || "", city: item.city || "",
          is_active: item.is_active,
        });
      } else {
        setLokasiForm({
          code: item.code, name: item.name,
          description: item.description || "", is_active: item.is_active,
        });
      }
    } else {
      setIsEdit(false);
      setEditId(null);
      setBarangForm({ code: "", name: "", brand: "", description: "", category_id: "", supplier_id: "", unit_id: "", storage_location_id: "", stock: 0, stock_minimum: 0, purchase_price: 0, is_active: true });
      setSupplierForm({ code: "", name: "", contact_person: "", phone: "", email: "", address: "", city: "", is_active: true });
      setLokasiForm({ code: "", name: "", description: "", is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      let response;
      if (activeTab === "barang") {
        const formData = new FormData();
        formData.append('code', barangForm.code);
        formData.append('name', barangForm.name);
        formData.append('brand', barangForm.brand);
        formData.append('description', barangForm.description);
        formData.append('stock', String(barangForm.stock));
        formData.append('stock_minimum', String(barangForm.stock_minimum));
        formData.append('purchase_price', String(barangForm.purchase_price));
        formData.append('is_active', barangForm.is_active ? '1' : '0');
        if (barangForm.category_id) formData.append('category_id', barangForm.category_id);
        if (barangForm.supplier_id) formData.append('supplier_id', barangForm.supplier_id);
        if (barangForm.unit_id) formData.append('unit_id', barangForm.unit_id);
        if (barangForm.storage_location_id) formData.append('storage_location_id', barangForm.storage_location_id);
        if (imageFile) formData.append('image', imageFile);

        response = isEdit
          ? await apiClient.putForm(`/items/${editId}`, formData)
          : await apiClient.postForm("/items", formData);
        if (response.status) { await fetchBarang(); setShowModal(false); }
      } else if (activeTab === "supplier") {
        response = isEdit ? await apiClient.put(`/suppliers/${editId}`, supplierForm) : await apiClient.post("/suppliers", supplierForm);
        if (response.status) { await fetchSupplier(); setShowModal(false); }
      } else {
        response = isEdit ? await apiClient.put(`/storage-locations/${editId}`, lokasiForm) : await apiClient.post("/storage-locations", lokasiForm);
        if (response.status) { await fetchLokasi(); setShowModal(false); }
      }
      if (response && !response.status) setFormError(response.message || "Gagal menyimpan data.");
    } catch (err: any) {
      const errors = err?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        setFormError(firstError[0]);
      } else {
        setFormError(err?.message || "Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      if (activeTab === "barang")   { const r = await apiClient.delete(`/items/${id}`);            if (r.status) await fetchBarang(); }
      if (activeTab === "supplier") { const r = await apiClient.delete(`/suppliers/${id}`);         if (r.status) await fetchSupplier(); }
      if (activeTab === "lokasi")   { const r = await apiClient.delete(`/storage-locations/${id}`); if (r.status) await fetchLokasi(); }
    } catch { alert("Gagal menghapus data."); }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/categories", { name: categoryForm.name });
      if (response.status) {
        await fetchCategory();
        setShowCategoryModal(false);
        setCategoryForm({ name: "" });
      }
    } catch { alert("Gagal menambah kategori."); }
  };

  const tabs = [
    { id: "barang",   label: "Barang",   icon: Package },
    { id: "supplier", label: "Supplier", icon: Users },
    { id: "lokasi",   label: "Lokasi",   icon: MapPin },
  ];

  const getTambahLabel = () =>
    activeTab === "barang" ? "Barang" : activeTab === "supplier" ? "Supplier" : "Lokasi";

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
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

        {/* Search & Tambah */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Cari ${getTambahLabel().toLowerCase()}...`}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Tambah {getTambahLabel()}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          {/* Tab Barang */}
          {activeTab === "barang" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Gambar</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kode</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama Barang</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Stok</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Supplier</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Lokasi</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBarang.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-gray-500 py-8">Tidak ada barang.</td></tr>
                  ) : filteredBarang.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{item.code}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {item.category?.name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.stock} {item.unit?.abbreviation || ""}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.supplier?.name || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{item.storage_location?.name || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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

          {/* Tab Supplier */}
          {activeTab === "supplier" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kode</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama Supplier</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kontak</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kota</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSupplier.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-gray-500 py-8">Tidak ada supplier.</td></tr>
                  ) : filteredSupplier.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{s.code}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{s.name}</td>
                      <td className="px-6 py-4 text-gray-600">{s.phone || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{s.email || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{s.city || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {s.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenModal(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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

          {/* Tab Lokasi */}
          {activeTab === "lokasi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLokasi.length === 0 ? (
                <p className="text-gray-500 col-span-3 text-center py-8">Tidak ada lokasi.</p>
              ) : filteredLokasi.map((l) => (
                <div key={l.id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#378ADD] hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-xl">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(l)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0C447C] mb-1">{l.name}</h3>
                  <p className="text-gray-600 mb-2">Kode: {l.code}</p>
                  {l.description && <p className="text-gray-500 text-sm">{l.description}</p>}
                  <span className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${l.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {l.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Tambah/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#0C447C] mb-6">
                {isEdit ? "Edit" : "Tambah"} {getTambahLabel()}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Form Barang */}
                {activeTab === "barang" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kode Barang</label>
                        <input type="text" value={barangForm.code} onChange={(e) => setBarangForm({ ...barangForm, code: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Contoh: KBL-001" required />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Nama Barang</label>
                        <input type="text" value={barangForm.name} onChange={(e) => setBarangForm({ ...barangForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Nama barang" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Brand</label>
                        <input type="text" value={barangForm.brand} onChange={(e) => setBarangForm({ ...barangForm, brand: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Nama brand" />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kategori</label>
                        <div className="flex gap-2">
                          <select value={barangForm.category_id} onChange={(e) => setBarangForm({ ...barangForm, category_id: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                            <option value="">Pilih Kategori</option>
                            {categoryList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <button type="button" onClick={() => setShowCategoryModal(true)}
                            className="px-3 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition">
                            <FolderPlus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Supplier</label>
                        <select value={barangForm.supplier_id} onChange={(e) => setBarangForm({ ...barangForm, supplier_id: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                          <option value="">Pilih Supplier</option>
                          {supplierList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Satuan</label>
                        <select value={barangForm.unit_id} onChange={(e) => setBarangForm({ ...barangForm, unit_id: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                          <option value="">Pilih Satuan</option>
                          {unitList.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Lokasi Penyimpanan</label>
                      <select value={barangForm.storage_location_id} onChange={(e) => setBarangForm({ ...barangForm, storage_location_id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                        <option value="">Pilih Lokasi</option>
                        {lokasiList.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Stok Awal</label>
                        <input type="number" value={barangForm.stock} onChange={(e) => setBarangForm({ ...barangForm, stock: Number(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" min={0} />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Stok Minimum</label>
                        <input type="number" value={barangForm.stock_minimum} onChange={(e) => setBarangForm({ ...barangForm, stock_minimum: Number(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" min={0} />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Harga Beli</label>
                      <input type="number" value={barangForm.purchase_price} onChange={(e) => setBarangForm({ ...barangForm, purchase_price: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" min={0} />
                    </div>

                    {/* Upload Gambar */}
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Gambar Barang</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#378ADD] transition"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="preview"
                            className="w-32 h-32 object-cover rounded-xl mb-2" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                            <p className="text-gray-500 text-sm">Klik untuk upload gambar</p>
                            <p className="text-gray-400 text-xs">JPG, JPEG, PNG, WEBP — Maks. 2MB</p>
                          </div>
                        )}
                        {imagePreview && (
                          <p className="text-xs text-gray-500 mt-1">Klik untuk ganti gambar</p>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </>
                )}

                {/* Form Supplier */}
                {activeTab === "supplier" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kode Supplier</label>
                        <input type="text" value={supplierForm.code} onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Contoh: SUP-002" required />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Nama Supplier</label>
                        <input type="text" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Nama supplier" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kontak Person</label>
                        <input type="text" value={supplierForm.contact_person} onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Nama kontak" />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">No. Telepon</label>
                        <input type="text" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="021-xxxxxxxx" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Email</label>
                        <input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="email@supplier.com" />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kota</label>
                        <input type="text" value={supplierForm.city} onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Jakarta" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Alamat</label>
                      <textarea rows={3} value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                        placeholder="Alamat lengkap supplier" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Status</label>
                      <select value={supplierForm.is_active ? "aktif" : "nonaktif"} onChange={(e) => setSupplierForm({ ...supplierForm, is_active: e.target.value === "aktif" })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Form Lokasi */}
                {activeTab === "lokasi" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Kode Lokasi</label>
                        <input type="text" value={lokasiForm.code} onChange={(e) => setLokasiForm({ ...lokasiForm, code: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Contoh: RAK-A1" required />
                      </div>
                      <div>
                        <label className="block mb-2 text-[#0C447C] font-medium">Nama Lokasi</label>
                        <input type="text" value={lokasiForm.name} onChange={(e) => setLokasiForm({ ...lokasiForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                          placeholder="Contoh: Rak A - Baris 1" required />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Deskripsi</label>
                      <textarea rows={3} value={lokasiForm.description} onChange={(e) => setLokasiForm({ ...lokasiForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                        placeholder="Deskripsi lokasi" />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#0C447C] font-medium">Status</label>
                      <select value={lokasiForm.is_active ? "aktif" : "nonaktif"} onChange={(e) => setLokasiForm({ ...lokasiForm, is_active: e.target.value === "aktif" })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </>
                )}

                {formError && <p className="text-red-600 text-sm">{formError}</p>}

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                    Batal
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-semibold disabled:opacity-70">
                    {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Tambah Kategori */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-xl font-bold text-[#0C447C] mb-6">Tambah Kategori Baru</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Nama Kategori</label>
                  <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
                    placeholder="Contoh: Sensor & Modul" required />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => { setShowCategoryModal(false); setCategoryForm({ name: "" }); }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                    Batal
                  </button>
                  <button type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-medium">
                    Tambah
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