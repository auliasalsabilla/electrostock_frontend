// hooks/useAuth.ts - Custom hook for authentication

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedUser && storedEmail) {
      setUser({
        id: 0, // Placeholder, fetch from API if needed
        email: storedEmail,
        role: storedUser as User['role'],
      });
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};