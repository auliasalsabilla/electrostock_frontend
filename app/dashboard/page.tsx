"use client";

import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { apiClient } from "@/lib/api";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
}

interface Transaction {
  id: number;
  code: string;
  type: "in" | "out";
  quantity: number;
  unit: string | null;
  transaction_date: string;
  item: { id: number; name: string; code: string } | null;
  user: { id: number; name: string } | null;
}

interface Item {
  id: number;
  stock: number;
}

export default function Dashboard() {
  const [loading, setLoading]   = useState(true);
  const [totalStok, setTotalStok]       = useState(0);
  const [barangMasuk, setBarangMasuk]   = useState(0);
  const [barangKeluar, setBarangKeluar] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [itemsRes, transactionsRes] = await Promise.all([
          apiClient.get("/items"),
          apiClient.get("/transactions"),
        ]);

        if (itemsRes.status) {
          const items: Item[] = itemsRes.data;
          const total = items.reduce((sum, item) => sum + (item.stock || 0), 0);
          setTotalStok(total);
        }

        if (transactionsRes.status) {
          const transactions: Transaction[] = transactionsRes.data;

          const masuk  = transactions.filter((t) => t.type === "in")
            .reduce((sum, t) => sum + t.quantity, 0);
          const keluar = transactions.filter((t) => t.type === "out")
            .reduce((sum, t) => sum + t.quantity, 0);

          setBarangMasuk(masuk);
          setBarangKeluar(keluar);
          setRecentTransactions(transactions.slice(0, 5));
        }
      } catch {
        // diamkan, biarkan tampil 0 / kosong jika gagal
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "short", year: "numeric",
    });
  };

  const stats: Stat[] = [
    {
      icon: Package, label: "Total Stok Barang",
      value: totalStok.toLocaleString("id-ID"),
      change: "Update real-time", color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp, label: "Barang Masuk",
      value: barangMasuk.toLocaleString("id-ID"),
      change: "Total seluruh transaksi", color: "from-green-500 to-green-600",
    },
    {
      icon: TrendingDown, label: "Barang Keluar",
      value: barangKeluar.toLocaleString("id-ID"),
      change: "Total seluruh transaksi", color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-2.5">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="max-w-[110px] text-[11px] font-medium text-gray-600 text-right leading-4">
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
              <p className="text-[26px] font-bold leading-none text-[#0C447C]">
                {loading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0C447C] flex items-center gap-2">
                <Activity className="w-4.5 h-4.5" />
                Aktivitas Terakhir
              </h3>
              <p className="text-xs text-gray-500 mt-1">Riwayat transaksi terbaru barang masuk dan keluar</p>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Memuat data...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada aktivitas transaksi.</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-2.5 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50 md:flex-row md:items-center"
                >
                  <div className={`w-fit p-2 rounded-lg ${transaction.type === "in" ? "bg-green-100" : "bg-orange-100"}`}>
                    {transaction.type === "in" ? (
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm font-semibold text-[#0C447C]">
                        {transaction.item?.name || "-"}
                      </p>
                      <span className={`text-xs md:text-sm font-semibold ${transaction.type === "in" ? "text-green-600" : "text-orange-600"}`}>
                        {transaction.type === "in" ? "+" : "-"}{transaction.quantity} {transaction.unit || ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {transaction.user?.name || "Sistem"} - {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}