import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import countChallenges from './tools/vite-count-challenges-plugin';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        TanStackRouterVite(),
        countChallenges('public/api/challenges'),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    optimizeDeps: {
        exclude: ['@electric-sql/pglite'],
    },
    build: {
        chunkSizeWarningLimit: 10240,

    },
    server: {
        allowedHosts: true
    }
});
