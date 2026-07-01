import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Allow access from any host
    port: 5173,
  },
  plugins: [react()],
});
