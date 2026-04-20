"use client";

import { useState } from "react";
import { FileText, Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface LaporanStok {
  id: number;
  nama: string;
  kategori: string;
  stokAwal: number;
  masuk: number;
  keluar: number;
  stokAkhir: number;
  tanggalMasuk: string;
  tanggalKeluar: string;
}

interface LaporanMasuk {
  id: number;
  tanggal: string;
  barang: string;
  kategori: string;
  qty: number;
  hargaSatuan: string;
  supplier: string;
  total: string;
}

interface LaporanKeluar {
  id: number;
  tanggal: string;
  barang: string;
  kategori: string;
  qty: number;
  tujuan: string;
  pic: string;
}

export default function Laporan() {
  const [activeTab, setActiveTab] = useState<string>("stok");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const categories = ["Resistor", "Kapasitor", "LED", "IC", "Transistor"];

  const laporanStok: LaporanStok[] = [
    { id: 1, nama: "Resistor 10K Ohm", kategori: "Resistor", stokAwal: 1000, masuk: 500, keluar: 300, stokAkhir: 1200, tanggalMasuk: "2 Apr 2026", tanggalKeluar: "2 Apr 2026" },
    { id: 2, nama: "Kapasitor 100uF", kategori: "Kapasitor", stokAwal: 500, masuk: 200, keluar: 250, stokAkhir: 450, tanggalMasuk: "1 Apr 2026", tanggalKeluar: "2 Apr 2026" },
    { id: 3, nama: "LED Merah 5mm", kategori: "LED", stokAwal: 2000, masuk: 1000, keluar: 800, stokAkhir: 2200, tanggalMasuk: "1 Apr 2026", tanggalKeluar: "1 Apr 2026" },
    { id: 4, nama: "IC 555 Timer", kategori: "IC", stokAwal: 300, masuk: 200, keluar: 180, stokAkhir: 320, tanggalMasuk: "31 Mar 2026", tanggalKeluar: "31 Mar 2026" },
  ];

  const laporanMasuk: LaporanMasuk[] = [
    { id: 1, tanggal: "2 Apr 2026", barang: "Resistor 10K Ohm", kategori: "Resistor", qty: 500, hargaSatuan: "Rp 1.000", supplier: "PT Elektronika Jaya", total: "Rp 500.000" },
    { id: 2, tanggal: "1 Apr 2026", barang: "LED Merah 5mm", kategori: "LED", qty: 1000, hargaSatuan: "Rp 750", supplier: "CV Komponen", total: "Rp 750.000" },
    { id: 3, tanggal: "31 Mar 2026", barang: "IC 555 Timer", kategori: "IC", qty: 200, hargaSatuan: "Rp 6.000", supplier: "UD Maju", total: "Rp 1.200.000" },
  ];

  const laporanKeluar: LaporanKeluar[] = [
    { id: 1, tanggal: "2 Apr 2026", barang: "Kapasitor 100uF", kategori: "Kapasitor", qty: 150, tujuan: "Produksi Batch A", pic: "Siti R." },
    { id: 2, tanggal: "1 Apr 2026", barang: "Transistor NPN", kategori: "Transistor", qty: 75, tujuan: "Project X", pic: "Dewi L." },
    { id: 3, tanggal: "31 Mar 2026", barang: "Dioda 1N4007", kategori: "LED", qty: 120, tujuan: "Produksi Batch B", pic: "Siti R." },
  ];

  const applyFilters = <T extends { kategori: string; tanggal?: string; tanggalMasuk?: string; stokAkhir?: number; qty?: number }>(data: T[]): T[] => {
    return data
      .filter((item) => {
        const matchCategory = selectedCategory === "all" || item.kategori === selectedCategory;
        let matchDate = true;
        if (startDate || endDate) {
          const itemDate = new Date(item.tanggal || item.tanggalMasuk || "");
          if (startDate) matchDate = matchDate && itemDate >= new Date(startDate);
          if (endDate) matchDate = matchDate && itemDate <= new Date(endDate);
        }
        return matchCategory && matchDate;
      })
      .sort((a, b) => {
        const valueA = a.stokAkhir ?? a.qty ?? 0;
        const valueB = b.stokAkhir ?? b.qty ?? 0;
        return sortOrder === "desc" ? valueB - valueA : valueA - valueB;
      });
  };

  const filteredLaporanStok = applyFilters(laporanStok);
  const filteredLaporanMasuk = applyFilters(laporanMasuk);
  const filteredLaporanKeluar = applyFilters(laporanKeluar);

  const handleExport = (type: "pdf" | "excel") => {
    alert(`Exporting as ${type.toUpperCase()}...`);
  };

  const hasActiveFilter = selectedCategory !== "all" || sortOrder !== "desc" || startDate || endDate;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Laporan & Analitik
              </h2>
              <p className="text-blue-100">Generate dan export laporan inventaris dalam berbagai format</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleExport("pdf")} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold shadow-lg">
                <Download className="w-5 h-5" />
                Export PDF
              </button>
              <button onClick={() => handleExport("excel")} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-semibold shadow-lg">
                <Download className="w-5 h-5" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#0C447C]" />
            <h3 className="text-lg font-semibold text-[#0C447C]">Filter Laporan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-[#0C447C] font-semibold">Kategori</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                <option value="all">Semua Kategori</option>
                {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-[#0C447C] font-semibold">Urutkan</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD]">
                <option value="desc">Tertinggi</option>
                <option value="asc">Terendah</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-[#0C447C] font-semibold">Rentang Tanggal</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#378ADD] text-sm" />
              </div>
            </div>
          </div>
          {hasActiveFilter && (
            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-[#0C447C]">
                <span className="font-semibold">Filter aktif:</span>{" "}
                {selectedCategory !== "all" ? `${selectedCategory}, ` : ""}
                {sortOrder === "desc" ? "Tertinggi" : "Terendah"}
                {startDate || endDate ? `, ${startDate || "..."} s/d ${endDate || "..."}` : ""}
              </p>
              <button onClick={() => { setSelectedCategory("all"); setSortOrder("desc"); setStartDate(""); setEndDate(""); }} className="px-4 py-1.5 text-sm bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition font-medium">
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2">
            {["stok", "masuk", "keluar"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 px-6 py-3 rounded-lg transition font-semibold ${activeTab === tab ? "bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}>
                {tab === "stok" ? "Laporan Stok" : tab === "masuk" ? "Barang Masuk" : "Barang Keluar"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "stok" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama Barang</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Stok Awal</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Masuk</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tgl Masuk</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Keluar</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tgl Keluar</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Stok Akhir</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Perubahan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporanStok.map((item) => {
                    const perubahan = item.stokAkhir - item.stokAwal;
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-[#0C447C] font-medium">{item.nama}</td>
                        <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.kategori}</span></td>
                        <td className="px-6 py-4 text-gray-600">{item.stokAwal}</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-600 font-semibold"><TrendingUp className="w-4 h-4" />+{item.masuk}</span></td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{item.tanggalMasuk}</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-1 text-orange-600 font-semibold"><TrendingDown className="w-4 h-4" />-{item.keluar}</span></td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{item.tanggalKeluar}</td>
                        <td className="px-6 py-4 text-[#0C447C] font-bold">{item.stokAkhir}</td>
                        <td className="px-6 py-4"><span className={`font-bold ${perubahan > 0 ? "text-green-600" : "text-red-600"}`}>{perubahan > 0 ? "+" : ""}{perubahan}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "masuk" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tanggal</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Barang</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Jumlah</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Harga Satuan</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Supplier</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Total Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporanMasuk.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{item.tanggal}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{item.barang}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.kategori}</span></td>
                      <td className="px-6 py-4"><span className="text-green-600 font-semibold">+{item.qty} Pcs</span></td>
                      <td className="px-6 py-4 text-gray-600">{item.hargaSatuan}</td>
                      <td className="px-6 py-4 text-gray-600">{item.supplier}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-bold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "keluar" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tanggal</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Barang</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Jumlah</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tujuan</th>
                    <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">PIC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporanKeluar.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-600">{item.tanggal}</td>
                      <td className="px-6 py-4 text-[#0C447C] font-medium">{item.barang}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.kategori}</span></td>
                      <td className="px-6 py-4"><span className="text-orange-600 font-semibold">-{item.qty} Pcs</span></td>
                      <td className="px-6 py-4 text-gray-600">{item.tujuan}</td>
                      <td className="px-6 py-4 text-gray-600">{item.pic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
