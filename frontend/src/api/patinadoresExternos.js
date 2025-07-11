import api from './api';

export const listarPatinadoresExternos = async (token) => {
  const res = await api.get('/patinadores-externos', {
    headers: { Authorization: token }
  });
  return res.data;
};
