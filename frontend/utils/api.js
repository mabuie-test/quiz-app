// frontend/utils/api.js
import axios from 'axios';

// URL fixa do seu back‑end
const baseURL = 'https://quiz-app-v99j.onrender.com/api';

console.log('🔧 API baseURL fixo:', baseURL);

const api = axios.create({ baseURL });

export default api;
