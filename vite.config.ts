import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter  } from '@tanstack/router-plugin/vite';
import createChallenges from './tools/vite-create-challenges-plugin';

if (process.loadEnvFile) {
    process.loadEnvFile('./.env');
}

const BASE_PATH = process.env.BASE_PATH || '';

// https://vite.dev/config/
export default defineConfig({
    base: BASE_PATH, // Set the base path for the application
    plugins: [        
        tailwindcss(),
        tanstackRouter({
            target: 'react', 
            autoCodeSplitting: true,
        }),
        react(),
        createChallenges({
            path: 'challenges',
            base: BASE_PATH, // Ensure the base path matches the Vite config base
            output: `public${BASE_PATH.length > 0 ? BASE_PATH : '/'}api/challenges`, // Output directory for generated challenges. Should be inside 'public' folder and match the base path.
        })
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
