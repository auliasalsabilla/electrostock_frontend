"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MainLayout from "@/components/MainLayout";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  trend: string;
  color: string;
}

interface ChartData {
  id: number;
  day: string;
  masuk: number;
  keluar: number;
}

interface Transaction {
  id: number;
  item: string;
  type: string;
  qty: number;
  date: string;
  user: string;
}

interface CriticalStock {
  name: string;
  current: number;
  minimum: number;
  percentage: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("admin");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  const stats: Stat[] = [
    { icon: Package, label: "Total Barang", value: "1,234", change: "+15 dari minggu lalu", trend: "up", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, label: "Barang Masuk", value: "156", change: "+8 dari minggu lalu", trend: "up", color: "from-green-500 to-green-600" },
    { icon: TrendingDown, label: "Barang Keluar", value: "89", change: "-3 dari minggu lalu", trend: "down", color: "from-orange-500 to-orange-600" },
    { icon: AlertTriangle, label: "Stok Minimum", value: "12", change: "+2 dari minggu lalu", trend: "alert", color: "from-red-500 to-red-600" },
  ];

  const chartData: ChartData[] = [
    { id: 1, day: "Sen", masuk: 45, keluar: 28 },
    { id: 2, day: "Sel", masuk: 52, keluar: 35 },
    { id: 3, day: "Rab", masuk: 38, keluar: 42 },
    { id: 4, day: "Kam", masuk: 65, keluar: 30 },
    { id: 5, day: "Jum", masuk: 48, keluar: 38 },
    { id: 6, day: "Sab", masuk: 55, keluar: 25 },
    { id: 7, day: "Min", masuk: 40, keluar: 20 },
  ];

  const recentTransactions: Transaction[] = [
    { id: 1, item: "Resistor 10K Ohm", type: "masuk", qty: 500, date: "2 Apr 2026", user: "Budi S." },
    { id: 2, item: "Kapasitor 100uF", type: "keluar", qty: 150, date: "2 Apr 2026", user: "Siti R." },
    { id: 3, item: "LED Merah 5mm", type: "masuk", qty: 1000, date: "1 Apr 2026", user: "Ahmad W." },
    { id: 4, item: "Transistor NPN", type: "keluar", qty: 75, date: "1 Apr 2026", user: "Dewi L." },
    { id: 5, item: "IC 555 Timer", type: "masuk", qty: 200, date: "31 Mar 2026", user: "Budi S." },
  ];

  const criticalStock: CriticalStock[] = [
    { name: "Resistor 10K Ohm", current: 15, minimum: 50, percentage: 30 },
    { name: "Kapasitor 100uF", current: 8, minimum: 30, percentage: 27 },
    { name: "LED Merah 5mm", current: 22, minimum: 100, percentage: 22 },
    { name: "Transistor NPN", current: 12, minimum: 40, percentage: 30 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend !== "alert" && (
                  <div className="text-xs font-medium text-gray-600 text-right max-w-[120px]">
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#0C447C]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0C447C] flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Aktivitas 7 Hari Terakhir
                </h3>
                <p className="text-sm text-gray-500 mt-1">Transaksi barang masuk dan keluar</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="masuk" fill="#378ADD" radius={[8, 8, 0, 0]} />
                <Bar dataKey="keluar" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#378ADD] rounded"></div>
                <span className="text-sm text-gray-600">Barang Masuk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f97316] rounded"></div>
                <span className="text-sm text-gray-600">Barang Keluar</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-[#0C447C] mb-4">Transaksi Terbaru</h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className={`p-2 rounded-lg ${transaction.type === "masuk" ? "bg-green-100" : "bg-orange-100"}`}>
                    {transaction.type === "masuk" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0C447C] truncate">{transaction.item}</p>
                    <p className="text-xs text-gray-500">{transaction.user} • {transaction.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${transaction.type === "masuk" ? "text-green-600" : "text-orange-600"}`}>
                    {transaction.type === "masuk" ? "+" : "-"}{transaction.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Stock Alert */}
        {(userRole === "admin" || userRole === "staff") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0C447C] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Stok Kritis - Perlu Perhatian
                </h3>
                <p className="text-sm text-gray-500 mt-1">Barang dengan stok di bawah minimum</p>
              </div>
              <button
                onClick={() => router.push("/notifikasi")}
                className="px-4 py-2 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition text-sm font-medium"
              >
                Lihat Semua
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {criticalStock.map((item, index) => (
                <div key={index} className="p-4 border border-red-200 rounded-xl bg-red-50/50 hover:bg-red-50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[#0C447C] mb-1">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Stok: <span className="font-semibold text-red-600">{item.current}</span> / Min: {item.minimum}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
