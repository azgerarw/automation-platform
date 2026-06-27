import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173
    },
    headers: {
      // Anti-clickjacking
      'X-Frame-Options': 'DENY',
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Permissions Policy (replaces Feature-Policy)
      'Permissions-Policy': [
        'accelerometer=()',
        'camera=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'payment=()',
        'usb=()'
      ].join(', '),
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})