import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // cambiar por tu backend productivo luego
});

export default api;
