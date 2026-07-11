"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Plus, Edit2, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import MainLayout from "@/components/MainLayout";

const API = process.env.NEXT_PUBLIC_API_URL;

const SATUAN_OPTIONS = ["pcs", "kg", "batang", "meter", "box", "roll"];

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
}

export default function Transaksi() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [items, setItems]               = useState<any[]>([]);
  const [activeTab, setActiveTab]       = useState<string>("semua");
  const [searchTerm, setSearchTerm]     = useState<string>("");
  const [showModal, setShowModal]       = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [editData, setEditData]         = useState<any>(null);
  const [loading, setLoading]           = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [toast, setToast]               = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [modalType, setModalType]       = useState<"in" | "out">("in");
  const [form, setForm] = useState({
    type:             "in",
    item_id:          "",
    quantity:         "",
    unit:             "pcs",
    price:            "",
    note:             "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  function getHeaders() {
    return {
      Accept:        "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    };
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetchTransactions();
    fetchItems();
  }, []);

  async function fetchTransactions() {
    try {
      const res  = await fetch(`${API}/transactions`, { headers: getHeaders() });
      const data = await res.json();
      if (data.status) setTransactions(data.data);
    } catch {
      showToast("error", "Gagal mengambil data transaksi");
    }
  }

  async function fetchItems() {
    try {
      const res  = await fetch(`${API}/items`, { headers: getHeaders() });
      const data = await res.json();
      if (data.status) setItems(data.data);
    } catch {}
  }

  function handleItemChange(itemId: string) {
    const item = items.find((i) => i.id.toString() === itemId);
    setSelectedItem(item || null);
    setForm({ ...form, item_id: itemId, unit: item?.unit?.abbreviation || "pcs" });
  }

  function openEdit(transaction: any) {
    setEditData(transaction);
    setModalType(transaction.type);
    const item = items.find((i) => i.id === transaction.item_id);
    setSelectedItem(item || null);
    setForm({
      type:             transaction.type,
      item_id:          transaction.item_id,
      quantity:         transaction.quantity.toString(),
      unit:             transaction.unit || "pcs",
      price:            transaction.price?.toString() || "",
      note:             transaction.note || "",
      transaction_date: transaction.transaction_date,
    });
    setShowModal(true);
  }

  function handleOpenModal(type: "in" | "out") {
    setEditData(null);
    setSelectedItem(null);
    setModalType(type);
    setForm({
      type,
      item_id:          "",
      quantity:         "",
      unit:             "pcs",
      price:            "",
      note:             "",
      transaction_date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  }

  function confirmHapus(id: number) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  async function handleHapus() {
    if (!deleteId || loading) return;

    setLoading(true);
    try {
      const res  = await fetch(`${API}/transactions/${deleteId}`, {
        method:  "DELETE",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.status) {
        await fetchTransactions();
        await fetchItems(); // refresh stok item setelah hapus transaksi
        showToast("success", "Transaksi berhasil dihapus!");
      } else {
        showToast("error", data.message || "Gagal menghapus transaksi");
      }
    } catch {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  }

  async function handleSimpan() {
    if (!form.item_id || !form.quantity || !form.transaction_date) {
      showToast("error", "Harap isi semua field yang diperlukan");
      return;
    }

    // Cegah submit dobel selagi request sebelumnya masih berjalan
    if (loading) return;

    const url    = editData ? `${API}/transactions/${editData.id}` : `${API}/transactions`;
    const method = editData ? "PUT" : "POST";

    // Field opsional (price, note) dikosongkan jadi null, bukan string kosong,
    // supaya tidak error saat disimpan ke kolom decimal/text di database.
    const payload = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      note:  form.note === "" ? null : form.note,
    };

    setLoading(true);
    try {
      const res  = await fetch(url, {
        method,
        headers: getHeaders(),
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status) {
        setShowModal(false);
        await fetchTransactions();
        await fetchItems(); // refresh stok item supaya sinkron dengan DB setelah transaksi baru
        showToast(
          "success",
          editData
            ? "Transaksi berhasil diupdate!"
            : form.type === "in"
              ? "Barang masuk berhasil ditambahkan!"
              : "Barang keluar berhasil ditambahkan!"
        );
      } else {
        showToast("error", data.message || "Gagal menyimpan transaksi");
      }
    } catch {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType =
      activeTab === "semua" ||
      (activeTab === "in"  && t.type === "in") ||
      (activeTab === "out" && t.type === "out");
    return matchSearch && matchType;
  });

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Tombol Stock In / Stock Out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleOpenModal("in")}
            className="group relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#2e7d32_0%,#388e3c_52%,#66bb6a_100%)] p-6 text-left text-white shadow-lg transition hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_40%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/20 p-3">
                  <ArrowDown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">Stock In</p>
                  <p className="text-sm text-green-50/85">Tambah Barang Masuk</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-white" />
            </div>
          </button>

          <button
            onClick={() => handleOpenModal("out")}
            className="group relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#b71c1c_0%,#c62828_52%,#ef5350_100%)] p-6 text-left text-white shadow-lg transition hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_40%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/20 p-3">
                  <ArrowUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">Stock Out</p>
                  <p className="text-sm text-red-50/85">Tambah Barang Keluar</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {["semua", "in", "out"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg transition font-medium text-sm ${
                    activeTab === tab ? "bg-white text-[#0C447C] shadow" : "text-gray-600 hover:text-[#0C447C]"
                  }`}
                >
                  {tab === "semua" ? "Semua" : tab === "in" ? "Masuk" : "Keluar"}
                </button>
              ))}
            </div>
            <div className="relative md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama barang atau kode..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Kode</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Kode Barang</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Nama Barang</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Jenis</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Jumlah</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Satuan</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Harga</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">User</th>
                  <th className="px-4 py-3 text-left text-[#0C447C] font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-gray-400">
                      Belum ada data transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-600 font-mono text-sm">{transaction.code}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-sm">{transaction.item?.code || "-"}</td>
                      <td className="px-4 py-3 text-[#0C447C] font-medium">{transaction.item?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                          transaction.type === "in" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {transaction.type === "in" ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                          {transaction.type === "in" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${transaction.type === "in" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "in" ? "+" : "-"}{transaction.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{transaction.unit || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {transaction.price ? `Rp ${Number(transaction.price).toLocaleString("id-ID")}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{transaction.note || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(transaction.transaction_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{transaction.user?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(transaction)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => confirmHapus(transaction.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl ${modalType === "in" ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-red-500 to-red-600"}`}>
                    {modalType === "in" ? <ArrowDown className="w-5 h-5 text-white" /> : <ArrowUp className="w-5 h-5 text-white" />}
                  </div>
                  <h2 className="text-xl font-bold text-[#0C447C]">
                    {editData ? "Edit Transaksi" : modalType === "in" ? "Tambah Barang Masuk" : "Tambah Barang Keluar"}
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Pilih Barang */}
                  <div>
                    <label className="block mb-1 text-[#0C447C] font-medium text-sm">Pilih Barang</label>
                    <select
                      value={form.item_id}
                      onChange={(e) => handleItemChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] bg-white text-sm"
                    >
                      <option value="">-- Pilih Barang --</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          [{item.code}] {item.name} — Stok: {item.stock}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Info Barang Terpilih */}
                  {selectedItem && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm">
                      <p className="text-[#0C447C] font-semibold">{selectedItem.name}</p>
                      <p className="text-gray-600">Kode: {selectedItem.code}</p>
                      <p className="text-gray-600">Harga: {selectedItem.purchase_price ? `Rp ${Number(selectedItem.purchase_price).toLocaleString("id-ID")}` : "-"}</p>
                      <p className="text-gray-600">Satuan: {selectedItem.unit?.name || "-"}</p>
                      <p className="text-gray-600">Stok: {selectedItem.stock}</p>
                    </div>
                  )}

                  {/* Jumlah & Satuan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-[#0C447C] font-medium text-sm">Jumlah</label>
                      <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[#0C447C] font-medium text-sm">Satuan</label>
                      <select
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] bg-white text-sm"
                      >
                        {SATUAN_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label className="block mb-1 text-[#0C447C] font-medium text-sm">Tanggal</label>
                    <input
                      type="date"
                      value={form.transaction_date}
                      onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm"
                    />
                  </div>

                  {/* Harga */}
                  <div>
                    <label className="block mb-1 text-[#0C447C] font-medium text-sm">Harga (Opsional)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Harga per unit"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm"
                    />
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block mb-1 text-[#0C447C] font-medium text-sm">Keterangan (Opsional)</label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Keterangan..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm">
                    Batal
                  </button>
                  <button
                    onClick={handleSimpan}
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 text-white rounded-xl hover:shadow-lg transition font-medium text-sm disabled:opacity-50 ${
                      modalType === "in" ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-red-100">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-[#0C447C]">Hapus Transaksi</h2>
              </div>
              <p className="text-gray-600 mb-6">Apakah kamu yakin ingin menghapus transaksi ini? Stok barang akan dikembalikan secara otomatis.</p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteModal(false); setDeleteId(null); }} className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm">
                  Batal
                </button>
                <button
                  onClick={handleHapus}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm disabled:opacity-50"
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
