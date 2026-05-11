// constants/routes.ts - Route constants

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DATA_MASTER: '/data-master',
  KELOLA_USER: '/kelola-user',
  LAPORAN: '/laporan',
  NOTIFIKASI: '/notifikasi',
  SETTINGS: '/settings',
  TRANSAKSI: '/transaksi',
  BACKUP_DATA: '/backup-data',
} as const;

export const API_ROUTES = {
  LOGIN: '/login',
  USERS: '/users',
  INVENTORY: '/inventory',
  TRANSACTIONS: '/transactions',
  REPORTS: '/reports',
} as const;