// frontend/utils/api.js
import axios from 'axios';

// Determina o baseURL de forma resiliente:
// 1. Se a variável de ambiente estiver definida (build time), usa‑a.
// 2. Caso contrário, em runtime cai para window.location.origin + '/api'.
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : (typeof window !== 'undefined'
      ? `${window.location.origin}/api`
      : '');

console.log('🔧 API baseURL:', baseURL);

const api = axios.create({ baseURL });

export default api;
