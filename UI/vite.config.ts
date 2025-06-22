import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Base path for assets when building
    base: './',
    build: {
      outDir: 'dist',
      // Generate sourcemaps for dev but not for production
      sourcemap: mode === 'development',
    },
    server: {
      // Configure port for development server
      port: 3000,
      open: true,
    },
    // Define env variables that should be available in the client
    define: {
      // Stringify the values so they're properly passed as strings
      __TESTING_ENV__: JSON.stringify(env.VITE_TESTING_ENVIRONMENT === 'true'),
    }
  }
})
