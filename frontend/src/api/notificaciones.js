import api from './api';

export const getNotificaciones = async (token) => {
  const res = await api.get('/notificaciones', {
    headers: { Authorization: token }
  });
  return res.data;
};
