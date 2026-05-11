# ElectroStock Frontend Documentation

## Overview
ElectroStock adalah sistem manajemen inventaris elektronik yang terdiri dari frontend (Next.js) dan backend (Laravel).

## Struktur Proyek
- `app/`: Next.js App Router untuk pages dan API routes
- `components/`: Komponen UI reusable
- `lib/`: Utility libraries dan helpers
- `hooks/`: Custom React hooks
- `types/`: TypeScript type definitions
- `services/`: Business logic dan API services
- `constants/`: Konstanta aplikasi
- `utils/`: Utility functions
- `context/`: React contexts
- `styles/`: Stylesheets tambahan
- `tests/`: Test files
- `public/`: Static assets

## Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` dan isi variabel environment
3. Run development server: `npm run dev`

## API Integration
Frontend berkomunikasi dengan backend Laravel via REST API. Base URL dikonfigurasi di `lib/api.ts`.

## Authentication
Menggunakan JWT token untuk authentication. Hook `useAuth` dan context `AuthContext` mengelola state auth.