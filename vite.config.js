import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedStockDir = path.resolve(__dirname, '../stock-fotos');

function serveSharedStockFotos() {
  return {
    name: 'serve-shared-stock-fotos',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        if (cleanUrl.startsWith('/stock-fotos/')) {
          const fileName = decodeURIComponent(cleanUrl.replace('/stock-fotos/', ''));
          const filePath = path.join(sharedStockDir, fileName);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [serveSharedStockFotos()],
  optimizeDeps: {
    exclude: ['gsap', 'gsap/ScrollTrigger'],
  },
  server: {
    open: false,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
