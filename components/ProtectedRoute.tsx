"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#378ADD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0C447C] font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}