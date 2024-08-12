import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel([
            'resources/js/dashboard.js',
            'resources/js/login.js',
        ]),
    ],
    build: {
        minify: 'terser', // Enable minification with Terser
        terserOptions: {
            compress: {
                drop_console: true, // Remove console statements
            },
            output: {
                comments: false, // Remove comments
            },
        },
        outDir: 'public/build', // Set the output directory
        assetsDir: 'assets', // Directory for static assets
    },
});
