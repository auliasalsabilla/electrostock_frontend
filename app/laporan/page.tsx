"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import MainLayout from "@/components/MainLayout";

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
}

function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export default function Laporan() {
  const [activeTab, setActiveTab]               = useState<string>("stok");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder]               = useState<string>("desc");
  const [startDate, setStartDate]               = useState<string>("");
  const [endDate, setEndDate]                   = useState<string>("");
  const [loading, setLoading]                   = useState<boolean>(false);

  const [stokList, setStokList]         = useState<any[]>([]);
  const [masukList, setMasukList]       = useState<any[]>([]);
  const [keluarList, setKeluarList]     = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);

  const hasFetched = useRef(false);

  const hasActiveFilter =
    selectedCategory !== "all" || sortOrder !== "desc" || !!startDate || !!endDate;

  useEffect(() => {
    fetch(`${API}/categories`, { headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCategoryList(data.data.map((c: any) => c.name));
      })
      .catch((err) => console.error("Gagal ambil kategori:", err));
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const dateParams = [
        startDate ? `&start_date=${startDate}` : "",
        endDate   ? `&end_date=${endDate}`     : "",
      ].join("");

      const [stokRes, masukRes, keluarRes] = await Promise.all([
        fetch(`${API}/reports/stock`, { headers: getHeaders() }),
        fetch(`${API}/reports/transactions?type=in${dateParams}`,  { headers: getHeaders() }),
        fetch(`${API}/reports/transactions?type=out${dateParams}`, { headers: getHeaders() }),
      ]);

      const stokData   = await stokRes.json();
      const masukData  = await masukRes.json();
      const keluarData = await keluarRes.json();

      if (stokData.status)   setStokList(stokData.data);
      if (masukData.status)  setMasukList(masukData.data);
      if (keluarData.status) setKeluarList(keluarData.data);
    } catch (err) {
      console.error("Gagal mengambil data laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchLaporan();
    }
  }, []);

  const applyFilters = (data: any[], valueKey: string) => {
    return data
      .filter((item) => {
        return (
          selectedCategory === "all" ||
          item.category?.name === selectedCategory ||
          item.item?.category?.name === selectedCategory
        );
      })
      .sort((a, b) => {
        const valueA = a[valueKey] ?? a.quantity ?? 0;
        const valueB = b[valueKey] ?? b.quantity ?? 0;
        return sortOrder === "desc" ? valueB - valueA : valueA - valueB;
      });
  };

  const filteredLaporanStok   = applyFilters(stokList,   "stock");
  const filteredLaporanMasuk  = applyFilters(masukList,  "quantity");
  const filteredLaporanKeluar = applyFilters(keluarList, "quantity");

  const handleExport = async (type: "pdf" | "excel") => {
    try {
      const dateParams = [
        startDate ? `&start_date=${startDate}` : "",
        endDate   ? `&end_date=${endDate}`     : "",
      ].join("");

      const format   = type === "pdf" ? "pdf" : "excel";
      const catParam = selectedCategory !== "all"
        ? `&category=${encodeURIComponent(selectedCategory)}`
        : "";
      const url = `${API}/reports/export?format=${format}&tab=${activeTab}${catParam}${dateParams}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        alert("Gagal export laporan. Coba login ulang.");
        return;
      }

      const blob      = await res.blob();
      const mimeType  = type === "pdf"
        ? "application/octet-stream"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const ext       = type === "pdf" ? "pdf" : "xlsx";
      const newBlob   = new Blob([blob], { type: mimeType });
      const objectUrl = URL.createObjectURL(newBlob);
      const link      = document.createElement("a");
      link.href       = objectUrl;
      link.download   = `laporan_${activeTab}_${new Date().toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);

    } catch (err) {
      console.error("Export error:", err);
      alert("Terjadi kesalahan saat export laporan.");
    }
  };

  const resetFilter = () => {
    setSelectedCategory("all");
    setSortOrder("desc");
    setStartDate("");
    setEndDate("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8" />
                Laporan Inventaris
              </h2>
              <p className="text-blue-100">Generate dan export laporan inventaris dalam format yang mudah dibaca</p>
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
                {categoryList.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
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

          <div className="mt-4 flex items-center gap-3">
            <button onClick={fetchLaporan} className="px-6 py-2 bg-[#0C447C] text-white rounded-xl hover:bg-[#378ADD] transition font-semibold">
              Terapkan Filter
            </button>
            {hasActiveFilter && (
              <button onClick={resetFilter} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition font-medium">
                Reset Filter
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-[#0C447C]">
                <span className="font-semibold">Filter aktif:</span>{" "}
                {selectedCategory !== "all" ? `${selectedCategory}, ` : ""}
                {sortOrder === "desc" ? "Tertinggi" : "Terendah"}
                {startDate || endDate ? `, ${startDate || "..."} s/d ${endDate || "..."}` : ""}
              </p>
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

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#378ADD] mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat data laporan...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
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
                    {filteredLaporanStok.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-8 text-gray-400">Belum ada data stok</td></tr>
                    ) : (
                      filteredLaporanStok.map((item) => {
                        const perubahan = item.total_masuk - item.total_keluar;
                        return (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-[#0C447C] font-medium">{item.name}</td>
                            <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.category?.name || "-"}</span></td>
                            <td className="px-6 py-4 text-gray-600">{item.stok_awal}</td>
                            <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-600 font-semibold"><TrendingUp className="w-4 h-4" />+{item.total_masuk}</span></td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{item.tgl_masuk ? new Date(item.tgl_masuk).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="px-6 py-4"><span className="flex items-center gap-1 text-orange-600 font-semibold"><TrendingDown className="w-4 h-4" />-{item.total_keluar}</span></td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{item.tgl_keluar ? new Date(item.tgl_keluar).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="px-6 py-4 text-[#0C447C] font-bold">{item.stock}</td>
                            <td className="px-6 py-4"><span className={`font-bold ${perubahan >= 0 ? "text-green-600" : "text-red-600"}`}>{perubahan >= 0 ? "+" : ""}{perubahan}</span></td>
                          </tr>
                        );
                      })
                    )}
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
                    {filteredLaporanMasuk.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400">Belum ada data barang masuk</td></tr>
                    ) : (
                      filteredLaporanMasuk.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-600">{new Date(item.transaction_date).toLocaleDateString("id-ID")}</td>
                          <td className="px-6 py-4 text-[#0C447C] font-medium">{item.item?.name || "-"}</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.item?.category?.name || "-"}</span></td>
                          <td className="px-6 py-4"><span className="text-green-600 font-semibold">+{item.quantity} Unit</span></td>
                          <td className="px-6 py-4 text-gray-600">{item.price ? `Rp ${Number(item.price).toLocaleString("id-ID")}` : "-"}</td>
                          <td className="px-6 py-4 text-gray-600">{item.item?.supplier?.name || "-"}</td>
                          <td className="px-6 py-4 text-[#0C447C] font-bold">{item.price ? `Rp ${(Number(item.price) * item.quantity).toLocaleString("id-ID")}` : "-"}</td>
                        </tr>
                      ))
                    )}
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
                    {filteredLaporanKeluar.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada data barang keluar</td></tr>
                    ) : (
                      filteredLaporanKeluar.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-600">{new Date(item.transaction_date).toLocaleDateString("id-ID")}</td>
                          <td className="px-6 py-4 text-[#0C447C] font-medium">{item.item?.name || "-"}</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item.item?.category?.name || "-"}</span></td>
                          <td className="px-6 py-4"><span className="text-orange-600 font-semibold">-{item.quantity} Unit</span></td>
                          <td className="px-6 py-4 text-gray-600">{item.note || "-"}</td>
                          <td className="px-6 py-4 text-gray-600">{item.user?.name || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}