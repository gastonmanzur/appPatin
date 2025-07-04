import api from './api';

export const crearAsistencia = async (data, token) => {
  const res = await api.post('/asistencias', data, { headers: { Authorization: token } });
  return res.data;
};

export const listarAsistencias = async (token) => {
  const res = await api.get('/asistencias', { headers: { Authorization: token } });
  return res.data;
};

export const obtenerAsistencia = async (id, token) => {
  const res = await api.get(`/asistencias/${id}`, { headers: { Authorization: token } });
  return res.data;
};

export const actualizarAsistencia = async (id, data, token) => {
  const res = await api.put(`/asistencias/${id}`, data, { headers: { Authorization: token } });
  return res.data;
};

export const eliminarAsistencia = async (id, token) => {
  const res = await api.delete(`/asistencias/${id}`, { headers: { Authorization: token } });
  return res.data;
};
