import api from './api';

export const crearTorneo = async (data, token) => {
  const res = await api.post('/torneos', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const listarTorneos = async (token) => {
  const res = await api.get('/torneos', {
    headers: { Authorization: token }
  });
  return res.data;
};

export const getRankingTorneo = async (id, token) => {
  const res = await api.get(`/torneos/${id}/ranking`, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const getRankingCategoriasTorneo = async (id, token) => {
  const res = await api.get(`/torneos/${id}/ranking-categorias`, {
    headers: { Authorization: token }
  });
  return res.data;
};
