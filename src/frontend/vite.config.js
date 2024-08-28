import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // or 'modules' depending on your needs
    outDir: 'dist', // Default output directory for production builds
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
