"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Search, ChevronRight } from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface Transaction {
  id: number;
  kode: string;
  barang: string;
  type: "masuk" | "keluar";
  qty: number;
  tanggal: string;
  user: string;
  keterangan: string;
}

export default function Transaksi() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"masuk" | "keluar">("masuk");

  const transactions: Transaction[] = [
    { id: 1, kode: "TRX-001", barang: "Resistor 10K Ohm", type: "masuk", qty: 500, tanggal: "2 Apr 2026", user: "Budi Santoso", keterangan: "Pembelian rutin" },
    { id: 2, kode: "TRX-002", barang: "Kapasitor 100uF", type: "keluar", qty: 150, tanggal: "2 Apr 2026", user: "Siti Rahayu", keterangan: "Produksi batch A" },
    { id: 3, kode: "TRX-003", barang: "LED Merah 5mm", type: "masuk", qty: 1000, tanggal: "1 Apr 2026", user: "Ahmad Wijaya", keterangan: "Restok dari PT Elektronika" },
    { id: 4, kode: "TRX-004", barang: "Transistor NPN", type: "keluar", qty: 75, tanggal: "1 Apr 2026", user: "Dewi Lestari", keterangan: "Project X" },
    { id: 5, kode: "TRX-005", barang: "IC 555 Timer", type: "masuk", qty: 200, tanggal: "31 Mar 2026", user: "Budi Santoso", keterangan: "Pembelian supplier baru" },
    { id: 6, kode: "TRX-006", barang: "Dioda 1N4007", type: "keluar", qty: 120, tanggal: "31 Mar 2026", user: "Siti Rahayu", keterangan: "Produksi batch B" },
    { id: 7, kode: "TRX-007", barang: "Resistor 1K Ohm", type: "masuk", qty: 800, tanggal: "30 Mar 2026", user: "Ahmad Wijaya", keterangan: "Stock rutin" },
  ];

  const filteredTransactions = transactions.filter((item) => {
    const matchSearch =
      item.barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = activeTab === "semua" || item.type === activeTab;
    return matchSearch && matchType;
  });

  const handleOpenModal = (type: "masuk" | "keluar") => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleOpenModal("masuk")}
            className="group relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#2e7d32_0%,#388e3c_52%,#66bb6a_100%)] p-6 text-left text-white shadow-[0_16px_30px_rgba(56,142,60,0.18)] transition hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(56,142,60,0.24)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_40%)]" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.10))]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/12 p-3 shadow-sm ring-1 ring-white/15 backdrop-blur-sm">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Stock In</p>
                  <p className="text-sm text-green-50/85">Tambah Barang Masuk</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white transition group-hover:translate-x-0.5" />
            </div>
          </button>
          <button
            onClick={() => handleOpenModal("keluar")}
            className="group relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#b71c1c_0%,#c62828_52%,#ef5350_100%)] p-6 text-left text-white shadow-[0_16px_30px_rgba(198,40,40,0.18)] transition hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(198,40,40,0.24)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_40%)]" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.10))]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/12 p-3 shadow-sm ring-1 ring-white/15 backdrop-blur-sm">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">Stock Out</p>
                  <p className="text-sm text-red-50/85">Tambah Barang Keluar</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white transition group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {["semua", "masuk", "keluar"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg transition font-medium ${
                    activeTab === tab
                      ? "bg-white text-[#0C447C] shadow"
                      : "text-gray-600 hover:text-[#0C447C]"
                  }`}
                >
                  {tab === "semua" ? "Semua" : tab === "masuk" ? "Masuk" : "Keluar"}
                </button>
              ))}
            </div>
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kode</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Barang</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Jenis</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Jumlah</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{transaction.kode}</td>
                    <td className="px-6 py-4 text-[#0C447C] font-medium">{transaction.barang}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        transaction.type === "masuk"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {transaction.type === "masuk" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {transaction.type === "masuk" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${transaction.type === "masuk" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "masuk" ? "+" : "-"}{transaction.qty} Unit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{transaction.tanggal}</td>
                    <td className="px-6 py-4 text-gray-600">{transaction.user}</td>
                    <td className="px-6 py-4 text-gray-600">{transaction.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${
                  modalType === "masuk"
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                }`}>
                  {modalType === "masuk" ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0C447C]">
                    {modalType === "masuk" ? "Tambah Barang Masuk" : "Tambah Barang Keluar"}
                  </h2>
                  <p className="text-sm text-gray-500">Isi form di bawah untuk menambah transaksi</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Pilih Barang</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                    <option value="">Pilih barang...</option>
                    <option>Resistor 10K Ohm</option>
                    <option>Kapasitor 100uF</option>
                    <option>LED Merah 5mm</option>
                    <option>IC 555 Timer</option>
                    <option>Transistor NPN</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Jumlah</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="0" />
                  </div>
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Tanggal</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" />
                  </div>
                </div>
                {modalType === "masuk" && (
                  <div>
                    <label className="block mb-2 text-[#0C447C] font-medium">Supplier</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                      <option value="">Pilih supplier...</option>
                      <option>PT Elektronika Jaya</option>
                      <option>CV Komponen Nusantara</option>
                      <option>UD Maju Sejahtera</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block mb-2 text-[#0C447C] font-medium">Keterangan</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]" placeholder="Keterangan tambahan..."></textarea>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                  Batal
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-6 py-3 text-white rounded-xl hover:shadow-xl transition font-medium ${
                    modalType === "masuk"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
