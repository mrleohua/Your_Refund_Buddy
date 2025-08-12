import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed at: https://mrleohua.github.io/Your_Refund_Buddy/
export default defineConfig({
  plugins: [react()],
  base: '/Your_Refund_Buddy/',
})
