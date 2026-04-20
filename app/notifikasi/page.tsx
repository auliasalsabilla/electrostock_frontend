"use client";

import { useState } from "react";
import { AlertTriangle, AlertCircle, Check, Package } from "lucide-react";
import MainLayout from "@/components/MainLayout";

interface Notification {
  id: number;
  item: string;
  current: number;
  minimum: number;
  percentage: number;
  status: "critical" | "warning";
  read: boolean;
}

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, item: "Resistor 10K Ohm", current: 15, minimum: 50, percentage: 30, status: "critical", read: false },
    { id: 2, item: "Kapasitor 100uF", current: 8, minimum: 30, percentage: 27, status: "critical", read: false },
    { id: 3, item: "LED Merah 5mm", current: 45, minimum: 100, percentage: 45, status: "warning", read: false },
    { id: 4, item: "Transistor NPN", current: 22, minimum: 40, percentage: 55, status: "warning", read: true },
    { id: 5, item: "IC 555 Timer", current: 38, minimum: 60, percentage: 63, status: "warning", read: true },
    { id: 6, item: "Dioda 1N4007", current: 12, minimum: 50, percentage: 24, status: "critical", read: false },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.status === "critical" && !n.read).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Alert Banner */}
        {criticalCount > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Peringatan Stok Kritis!</h3>
                <p className="text-red-100 text-lg">
                  Terdapat <span className="font-bold">{criticalCount} barang</span> dengan stok sangat rendah yang memerlukan perhatian segera.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-7 h-7 text-[#378ADD]" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Notifikasi</p>
                <p className="text-3xl font-bold text-[#0C447C]">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status Kritis</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-2 border-orange-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertCircle className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Belum Dibaca</p>
                <p className="text-3xl font-bold text-orange-600">{unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0C447C]">Notifikasi Stok</h2>
              <p className="text-gray-600 mt-1">Daftar barang yang mendekati atau di bawah stok minimum</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition font-medium"
              >
                <Check className="w-5 h-5" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 rounded-xl border-2 transition ${
                  notif.status === "critical"
                    ? "border-red-300 bg-red-50/50 hover:bg-red-50"
                    : "border-orange-300 bg-orange-50/50 hover:bg-orange-50"
                } ${!notif.read ? "shadow-md" : "opacity-70"}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${notif.status === "critical" ? "bg-red-500" : "bg-orange-500"}`}>
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-[#0C447C] mb-1">{notif.item}</h3>
                          <p className="text-sm text-gray-600">
                            Stok saat ini:{" "}
                            <span className={`font-bold ${notif.status === "critical" ? "text-red-600" : "text-orange-600"}`}>
                              {notif.current}
                            </span>{" "}
                            dari minimum {notif.minimum} unit
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${notif.status === "critical" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                          {notif.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                              notif.status === "critical"
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : "bg-gradient-to-r from-orange-500 to-orange-600"
                            }`}
                            style={{ width: `${notif.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                          notif.status === "critical" ? "bg-red-200 text-red-800" : "bg-orange-200 text-orange-800"
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                          {notif.status === "critical" ? "Kritis - Segera Restok" : "Peringatan - Perlu Perhatian"}
                        </span>
                        {!notif.read && (
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                            Baru
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm whitespace-nowrap"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                    <button className="px-4 py-2 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition font-medium text-sm whitespace-nowrap">
                      Restok Barang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
