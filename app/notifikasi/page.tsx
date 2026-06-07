"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, AlertCircle, Check, Package } from "lucide-react";
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

interface Notification {
  id: number;
  item_id: number;
  type: string;
  message: string;
  status: "critical" | "warning";
  is_read: boolean;
  item: {
    id: number;
    name: string;
    stock: number;
    stock_minimum: number;
  };
}

export default function Notifikasi() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState<boolean>(false);
  const hasFetched                        = useRef(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/notifications`, { headers: getHeaders() });
      const data = await res.json();
      if (data.status) setNotifications(data.data);
    } catch (err) {
      console.error("Gagal ambil notifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchNotifications();
    }
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Gagal tandai dibaca:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Gagal tandai semua dibaca:", err);
    }
  };

  const unreadCount   = notifications.filter((n) => !n.is_read).length;
  const criticalCount = notifications.filter((n) => n.status === "critical" && !n.is_read).length;

  const getPercentage = (notif: Notification) => {
    if (!notif.item || notif.item.stock_minimum === 0) return 0;
    return Math.round((notif.item.stock / notif.item.stock_minimum) * 100);
  };

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
              <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition font-medium">
                <Check className="w-5 h-5" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#378ADD] mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat notifikasi...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada notifikasi stok rendah</p>
              <p className="text-gray-400 text-sm mt-1">Semua stok barang dalam kondisi aman</p>
            </div>
          )}

          {/* List */}
          {!loading && notifications.length > 0 && (
            <div className="space-y-4">
              {notifications.map((notif) => {
                const percentage = getPercentage(notif);
                return (
                  <div key={notif.id} className={`p-6 rounded-xl border-2 transition ${
                    notif.status === "critical"
                      ? "border-red-300 bg-red-50/50 hover:bg-red-50"
                      : "border-orange-300 bg-orange-50/50 hover:bg-orange-50"
                  } ${!notif.is_read ? "shadow-md" : "opacity-70"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${notif.status === "critical" ? "bg-red-500" : "bg-orange-500"}`}>
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-[#0C447C] mb-1">
                                {notif.item?.name || "-"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Stok saat ini:{" "}
                                <span className={`font-bold ${notif.status === "critical" ? "text-red-600" : "text-orange-600"}`}>
                                  {notif.item?.stock ?? 0}
                                </span>{" "}
                                dari minimum {notif.item?.stock_minimum ?? 0} unit
                              </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${notif.status === "critical" ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}>
                              {percentage}%
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
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
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
                            {!notif.is_read && (
                              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                                Baru
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {!notif.is_read && (
                          <button onClick={() => markAsRead(notif.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm whitespace-nowrap">
                            Tandai Dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}