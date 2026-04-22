"use client";

import { useState } from "react";
import { Database, Download, Upload, Trash2, X, AlertCircle, CheckCircle, Clock } from "lucide-react";
import MainLayout from "@/components/MainLayout";

type BackupStatus = "processing" | "success" | "error";

interface BackupHistory {
  id: number;
  filename: string;
  date: string;
  size: string;
  status: string;
  user: string;
}

interface StatusBadge {
  bg: string;
  text: string;
  icon: React.ElementType;
}

export default function BackupData() {
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [backupProgress, setBackupProgress] = useState<number>(0);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>("processing");

  const backupHistory: BackupHistory[] = [
    { id: 1, filename: "backup_20260402_143052.sql", date: "2 Apr 2026 14:30", size: "2.4 MB", status: "berhasil", user: "Admin" },
    { id: 2, filename: "backup_20260401_090015.sql", date: "1 Apr 2026 09:00", size: "2.3 MB", status: "berhasil", user: "Admin" },
    { id: 3, filename: "backup_20260331_235945.sql", date: "31 Mar 2026 23:59", size: "2.2 MB", status: "sebagian", user: "System" },
    { id: 4, filename: "backup_20260330_180020.sql", date: "30 Mar 2026 18:00", size: "2.1 MB", status: "berhasil", user: "Admin" },
    { id: 5, filename: "backup_20260329_120000.sql", date: "29 Mar 2026 12:00", size: "0 KB", status: "gagal", user: "System" },
  ];

  const handleBackup = () => {
    setShowProgressModal(true);
    setBackupProgress(0);
    setBackupStatus("processing");

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRestore = () => {
    if (confirm("Apakah Anda yakin ingin restore data? Data saat ini akan digantikan dengan data backup.")) {
      alert("Fitur restore akan segera dimulai. Silakan pilih file backup.");
    }
  };

  const handleDelete = (id: number, filename: string) => {
    if (confirm(`Hapus backup "${filename}"?`)) {
      alert("Backup berhasil dihapus");
    }
  };

  const getStatusBadge = (status: string): StatusBadge => {
    const badges: Record<string, StatusBadge> = {
      berhasil: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      sebagian: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertCircle },
      gagal: { bg: "bg-red-100", text: "text-red-700", icon: X },
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
                Lindungi data inventaris Anda dengan backup berkala. Backup otomatis berjalan setiap hari pada pukul 23:59 WIB.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Backup terakhir: <span className="font-semibold text-[#0C447C]">2 Apr 2026, 14:30 WIB</span></span>
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
              <p className="text-sm opacity-80">Kembalikan dari backup</p>
            </div>
          </button>
        </div>

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
                {backupHistory.map((backup) => {
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
                        <div className="flex items-center gap-2">
                          {backup.status !== "gagal" && (
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(backup.id, backup.filename)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#0C447C] mb-6">Pengaturan Backup</h3>
          <div className="space-y-4">
            {[
              { label: "Backup Otomatis Harian", desc: "Backup otomatis setiap hari pukul 23:59 WIB" },
              { label: "Hapus Backup Lama", desc: "Hapus otomatis backup lebih dari 30 hari" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-[#0C447C] font-semibold mb-1">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <label className="relative inline-block w-14 h-7 cursor-pointer">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-7"></div>
                </label>
              </div>
            ))}
            <div className="p-4 border border-gray-200 rounded-xl">
              <p className="text-[#0C447C] font-semibold mb-3">Lokasi Penyimpanan</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue="/var/backups/electrostock/"
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                />
                <button className="px-4 py-2 bg-[#378ADD] text-white rounded-lg hover:bg-[#0C447C] transition font-medium">
                  Ubah
                  
                </button>
              </div>
            </div>
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
                  <h3 className="text-2xl font-bold text-[#0C447C] text-center mb-2">Backup Sedang Berjalan</h3>
                  <p className="text-center text-gray-600 mb-6">Mohon tunggu, proses backup sedang berlangsung...</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#378ADD]">{backupProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#378ADD] to-[#0C447C] transition-all duration-300"
                        style={{ width: `${backupProgress}%` }}
                      ></div>
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
                  <h3 className="text-2xl font-bold text-[#0C447C] text-center mb-2">Backup Berhasil!</h3>
                  <p className="text-center text-gray-600 mb-6">
                    Data berhasil di-backup. File backup dapat diunduh dari tabel riwayat backup.
                  </p>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-[#378ADD] to-[#0C447C] text-white rounded-xl hover:shadow-xl transition font-semibold"
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
