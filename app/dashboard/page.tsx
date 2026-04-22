"use client";

import {
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
}

interface Transaction {
  id: number;
  item: string;
  type: "masuk" | "keluar";
  qty: number;
  date: string;
  user: string;
}

export default function Dashboard() {
  const stats: Stat[] = [
    { icon: Package, label: "Total Stok Barang", value: "1,234", change: "+15 dari minggu lalu", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, label: "Barang Masuk", value: "156", change: "+8 dari minggu lalu", color: "from-green-500 to-green-600" },
    { icon: TrendingDown, label: "Barang Keluar", value: "89", change: "-3 dari minggu lalu", color: "from-orange-500 to-orange-600" },
  ];

  const recentTransactions: Transaction[] = [
    { id: 1, item: "Resistor 10K Ohm", type: "masuk", qty: 500, date: "Senin, 2 Apr 2026", user: "Budi S." },
    { id: 2, item: "Kapasitor 100uF", type: "keluar", qty: 150, date: "Senin, 2 Apr 2026", user: "Siti R." },
    { id: 3, item: "LED Merah 5mm", type: "masuk", qty: 1000, date: "Kamis, 1 Apr 2026", user: "Ahmad W." },
    { id: 4, item: "Transistor NPN", type: "keluar", qty: 75, date: "Kamis, 1 Apr 2026", user: "Dewi L." },
    { id: 5, item: "IC 555 Timer", type: "masuk", qty: 200, date: "Rabu, 31 Mar 2026", user: "Budi S." },
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
              <p className="text-[26px] font-bold leading-none text-[#0C447C]">{stat.value}</p>
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
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-2.5 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50 md:flex-row md:items-center"
              >
                <div className={`w-fit p-2 rounded-lg ${transaction.type === "masuk" ? "bg-green-100" : "bg-orange-100"}`}>
                  {transaction.type === "masuk" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-semibold text-[#0C447C]">{transaction.item}</p>
                    <span className={`text-xs md:text-sm font-semibold ${transaction.type === "masuk" ? "text-green-600" : "text-orange-600"}`}>
                      {transaction.type === "masuk" ? "+" : "-"}{transaction.qty} Unit
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {transaction.user} - {transaction.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
