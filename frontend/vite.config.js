import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Dev-server proxy: empty API_BASE requests go to the FastAPI backend.
    // Production builds use VITE_API_BASE_URL env var instead.
    proxy: {
      "/stations":     "http://127.0.0.1:8000",
      "/observations": "http://127.0.0.1:8000",
      "/forecast":     "http://127.0.0.1:8000",
      "/weather":      "http://127.0.0.1:8000",
      "/wrf-chem":     "http://127.0.0.1:8000",
      "/fire":         "http://127.0.0.1:8000",
      "/pipeline":     "http://127.0.0.1:8000",
      "/health":       "http://127.0.0.1:8000",
      "/gemini":       "http://127.0.0.1:8000",
    },
  },
})
