"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  FileText,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  UserCog,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("admin");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    const email = localStorage.getItem("userEmail") || "";
    setUserRole(role);
    setUserEmail(email);
  }, []);

  const getMenuItems = (): MenuItem[] => {
    const adminMenu: MenuItem[] = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Package, label: "Data Master", path: "/data-master" },
      { icon: ArrowDownToLine, label: "Transaksi", path: "/transaksi" },
      { icon: FileText, label: "Laporan", path: "/laporan" },
      { icon: Bell, label: "Notifikasi Stok", path: "/notifikasi" },
      { icon: UserCog, label: "Manajemen User", path: "/kelola-user" },
      { icon: Database, label: "Backup Data", path: "/backup-data" },
      { icon: SettingsIcon, label: "Settings", path: "/settings" },
    ];

    const managerMenu: MenuItem[] = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: FileText, label: "Laporan", path: "/laporan" },
      { icon: SettingsIcon, label: "Settings", path: "/settings" },
    ];

    const staffMenu: MenuItem[] = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: ArrowDownToLine, label: "Transaksi", path: "/transaksi" },
      { icon: Bell, label: "Notifikasi Stok", path: "/notifikasi" },
      { icon: SettingsIcon, label: "Settings", path: "/settings" },
    ];

    if (userRole === "manager") return managerMenu;
    if (userRole === "staff") return staffMenu;
    return adminMenu;
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      manager: "Manager",
      staff: "Staff Gudang",
    };
    return labels[role] || "User";
  };

  const getUserInitial = (): string => {
    if (userEmail) return userEmail.charAt(0).toUpperCase();
    return "U";
  };

  const isActive = (path: string): boolean => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-[#0C447C] to-[#378ADD] text-white transition-all duration-300 flex flex-col shadow-2xl fixed h-screen z-40`}
      >
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && <span className="font-semibold text-base">ElectroStock</span>}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-all relative group ${
                isActive(item.path) ? "bg-white/20 border-r-4 border-white" : "hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-red-500/20 rounded-xl transition">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
        <header
          className="bg-white shadow-sm px-8 py-5 border-b border-gray-200 fixed top-0 right-0 z-30"
          style={{ left: sidebarOpen ? "288px" : "80px", transition: "left 0.3s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0C447C]">
                {menuItems.find((item) => isActive(item.path))?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {(userRole === "admin" || userRole === "staff") && (
                <button onClick={() => router.push("/notifikasi")} className="relative p-3 hover:bg-gray-100 rounded-xl transition">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                </button>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-11 h-11 bg-gradient-to-br from-[#378ADD] to-[#0C447C] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold">{getUserInitial()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0C447C]">{userEmail.split("@")[0]}</p>
                  <p className="text-xs text-gray-500">{getRoleLabel(userRole)}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 mt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
