"use client";

import { useState, useEffect, useRef } from "react";
import { Database, Download, Upload, Trash2, X, AlertCircle, CheckCircle, Clock } from "lucide-react";
import MainLayout from "@/components/MainLayout";

const API = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
}

interface BackupHistory {
  id: number;
  filename: string;
  date: string;
  size: string;
  status: string;
  user: string;
}

export default function BackupData() {
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [backupProgress, setBackupProgress]       = useState<number>(0);
  const [backupStatus, setBackupStatus]           = useState<"processing" | "success" | "error">("processing");
  const [backupHistory, setBackupHistory]         = useState<BackupHistory[]>([]);
  const [lastBackup, setLastBackup]               = useState<string>("-");
  const [isRestore, setIsRestore]                 = useState<boolean>(false);
  const fileInputRef                              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("backup_history");
    if (saved) setBackupHistory(JSON.parse(saved));
    const last = localStorage.getItem("last_backup");
    if (last) setLastBackup(last);
  }, []);

  const handleBackup = async () => {
    setIsRestore(false);
    setShowProgressModal(true);
    setBackupProgress(0);
    setBackupStatus("processing");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBackupProgress(Math.min(progress, 80));
    }, 200);

    try {
      const res = await fetch(`${API}/backup`, {
        method:  "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept:        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      clearInterval(interval);

      if (!res.ok) {
        setBackupProgress(100);
        setBackupStatus("error");
        return;
      }

      const blob      = await res.blob();
      const filename  = `backup_${new Date().toISOString().replace(/[:.]/g, "_")}.xlsx`;
      const newBlob   = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const objectUrl = URL.createObjectURL(newBlob);
      const link      = document.createElement("a");
      link.href        = objectUrl;
      link.download    = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(objectUrl);
      }, 1000);

      const now     = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      }) + " " + now.toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit",
      });

      const newHistory = [
        {
          id:       Date.now(),
          filename,
          date:     dateStr,
          size:     (blob.size / 1024).toFixed(1) + " KB",
          status:   "berhasil",
          user:     localStorage.getItem("userEmail")?.split("@")[0] || "Admin",
        },
        ...backupHistory,
      ].slice(0, 10);

      setBackupHistory(newHistory);
      setLastBackup(dateStr);
      localStorage.setItem("backup_history", JSON.stringify(newHistory));
      localStorage.setItem("last_backup", dateStr);
      setBackupProgress(100);
      setBackupStatus("success");

    } catch (err) {
      clearInterval(interval);
      console.error("Backup error:", err);
      setBackupProgress(100);
      setBackupStatus("error");
    }
  };

  const handleRestore = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("File harus berformat .xlsx");
      return;
    }

    setIsRestore(true);
    setShowProgressModal(true);
    setBackupProgress(0);
    setBackupStatus("processing");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBackupProgress(Math.min(progress, 80));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API}/restore`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body:    formData,
      });

      clearInterval(interval);
      const data = await res.json();

      if (data.status) {
        setBackupProgress(100);
        setBackupStatus("success");
      } else {
        console.error("Restore error:", data.message);
        setBackupProgress(100);
        setBackupStatus("error");
      }
    } catch (err) {
      clearInterval(interval);
      console.error("Restore error:", err);
      setBackupProgress(100);
      setBackupStatus("error");
    }

    e.target.value = "";
  };

  const handleDelete = (id: number, filename: string) => {
    if (confirm(`Hapus backup "${filename}"?`)) {
      const updated = backupHistory.filter((b) => b.id !== id);
      setBackupHistory(updated);
      localStorage.setItem("backup_history", JSON.stringify(updated));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      berhasil: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      sebagian: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertCircle },
      gagal:    { bg: "bg-red-100",    text: "text-red-700",    icon: X },
    };
    return badges[status] || badges.berhasil;
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0C447C] mb-2">Backup & Restore Data</h3>
              <p className="text-gray-600 mb-4">
                Lindungi data inventaris Anda dengan backup berkala. File backup disimpan dalam format Excel (.xlsx) yang mudah dibaca.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Backup terakhir: <span className="font-semibold text-[#0C447C]">{lastBackup}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleBackup}
            className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition transform hover:scale-105"
          >
            <Download className="w-7 h-7" />
            <div className="text-left">
              <p className="text-lg font-bold">Backup Data Sekarang</p>
              <p className="text-sm text-blue-100">Buat backup manual database</p>
            </div>
          </button>
          <button
            onClick={handleRestore}
            className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-[#378ADD] text-[#378ADD] rounded-xl hover:bg-[#378ADD] hover:text-white transition transform hover:scale-105"
          >
            <Upload className="w-7 h-7" />
            <div className="text-left">
              <p className="text-lg font-bold">Restore Data</p>
              <p className="text-sm opacity-80">Kembalikan dari backup .xlsx</p>
            </div>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Backup History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#0C447C] mb-6">Riwayat Backup</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Nama File</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Tanggal & Waktu</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Ukuran</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-[#0C447C] font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      Belum ada riwayat backup
                    </td>
                  </tr>
                ) : (
                  backupHistory.map((backup) => {
                    const statusBadge = getStatusBadge(backup.status);
                    return (
                      <tr key={backup.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-400" />
                            <span className="text-[#0C447C] font-mono text-sm">{backup.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{backup.date}</td>
                        <td className="px-6 py-4 text-gray-600">{backup.size}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                            <statusBadge.icon className="w-4 h-4" />
                            {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{backup.user}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(backup.id, backup.filename)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Modal */}
        {showProgressModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              {backupStatus === "processing" && (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-full animate-pulse">
                      <Database className="w-12 h-12 text-[#378ADD]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0C447C] text-center mb-2">
                    {isRestore ? "Restore Sedang Berjalan" : "Backup Sedang Berjalan"}
                  </h3>
                  <p className="text-center text-gray-600 mb-6">
                    {isRestore ? "Mohon tunggu, proses restore sedang berlangsung..." : "Mohon tunggu, proses backup sedang berlangsung..."}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#378ADD]">{backupProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#378ADD] to-[#0C447C] transition-all duration-300"
                        style={{ width: `${backupProgress}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {backupStatus === "success" && (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-100 rounded-full">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0C447C] text-center mb-2">
                    {isRestore ? "Restore Berhasil!" : "Backup Berhasil!"}
                  </h3>
                  <p className="text-center text-gray-600 mb-6">
                    {isRestore
                      ? "Data berhasil dipulihkan dari file backup."
                      : "File Excel backup berhasil diunduh ke komputer Anda."}
                  </p>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-semibold"
                  >
                    Tutup
                  </button>
                </>
              )}

              {backupStatus === "error" && (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                      <X className="w-12 h-12 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0C447C] text-center mb-2">
                    {isRestore ? "Restore Gagal!" : "Backup Gagal!"}
                  </h3>
                  <p className="text-center text-gray-600 mb-6">
                    {isRestore
                      ? "Terjadi kesalahan saat restore. Pastikan file backup valid."
                      : "Terjadi kesalahan saat backup. Coba lagi."}
                  </p>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
                  >
                    Tutup
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}