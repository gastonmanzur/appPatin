import api from './api';

export const getNotificaciones = async (token) => {
  const res = await api.get('/notificaciones', {
    headers: { Authorization: token }
  });
  return res.data;
};

export const marcarLeida = async (id, token) => {
  const res = await api.put(`/notificaciones/${id}/leida`, {}, {
    headers: { Authorization: token }
  });
  return res.data;
};
