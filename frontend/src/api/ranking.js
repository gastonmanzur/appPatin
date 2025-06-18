import api from './api';

export const getRankingGeneral = async (token) => {
  const res = await api.get('/ranking/general', {
    headers: { Authorization: token }
  });
  return res.data;
};

export const getRankingPorCategorias = async (token) => {
  const res = await api.get('/ranking/categorias', {
    headers: { Authorization: token }
  });
  return res.data;
};
