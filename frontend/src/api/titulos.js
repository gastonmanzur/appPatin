import api from './api';

// Títulos individuales
export const crearTituloIndividual = async (data, token) => {
  const res = await api.post('/titulos/individual', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const listarTitulosIndividuales = async (token) => {
  const res = await api.get('/titulos/individual', {
    headers: { Authorization: token }
  });
  return res.data;
};

// Títulos de club
export const crearTituloClub = async (data, token) => {
  const res = await api.post('/titulos/club', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const listarTitulosClub = async (token) => {
  const res = await api.get('/titulos/club', {
    headers: { Authorization: token }
  });
  return res.data;
};
