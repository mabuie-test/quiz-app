// frontend/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL  // deverá ser https://seu-backend.onrender.com/api
});

export default api;
