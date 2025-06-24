import api from './api';

export const crearSolicitudSeguro = async (datos, token) => {
  const res = await api.post('/seguros', datos, {
    headers: { Authorization: token }
  });
  return res.data;
};
