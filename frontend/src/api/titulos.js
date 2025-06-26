import api from './api';

// Títulos individuales
export const crearTituloIndividual = async (data, token) => {
  const res = await api.post('/titulos/individual', data, {
    headers: {
      Authorization: token,
      ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
    }
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
    headers: {
      Authorization: token,
      ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
    }
  });
  return res.data;
};

export const listarTitulosClub = async (token) => {
  const res = await api.get('/titulos/club', {
    headers: { Authorization: token }
  });
  return res.data;
};

export const editarTituloIndividual = async (id, data, token) => {
  const res = await api.put(`/titulos/individual/${id}`, data, {
    headers: {
      Authorization: token,
      ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
    }
  });
  return res.data;
};

export const eliminarTituloIndividual = async (id, token) => {
  const res = await api.delete(`/titulos/individual/${id}`, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const editarTituloClub = async (id, data, token) => {
  const res = await api.put(`/titulos/club/${id}`, data, {
    headers: {
      Authorization: token,
      ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
    }
  });
  return res.data;
};

export const eliminarTituloClub = async (id, token) => {
  const res = await api.delete(`/titulos/club/${id}`, {
    headers: { Authorization: token }
  });
  return res.data;
};
