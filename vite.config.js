import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.VITE_BASE_URL || '/';

  return {
    base: `${basePath}${basePath.endsWith('/') ? '' : '/'}`,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      historyApiFallback: true,
    },
    resolve: {
      alias: {
        hook: '/src/hook',
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
});
