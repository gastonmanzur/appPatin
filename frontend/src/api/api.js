import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://backend-app-s246.onrender.com'}/api`,
});

export default api;
