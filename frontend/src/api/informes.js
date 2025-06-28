import api from './api';

export const crearInforme = async (data, token) => {
  const res = await api.post('/informes', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const obtenerInformes = async (patinadorId, token) => {
  const res = await api.get(`/informes/patinador/${patinadorId}`, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const editarInforme = async (id, data, token) => {
  const res = await api.put(`/informes/${id}`, data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const eliminarInforme = async (id, token) => {
  const res = await api.delete(`/informes/${id}`, {
    headers: { Authorization: token }
  });
  return res.data;
};
