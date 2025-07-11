import api from './api';

export const listarPatinadoresExternos = async (token, categoria) => {
  const res = await api.get('/patinadores-externos', {
    params: categoria ? { categoria } : {},
    headers: { Authorization: token }
  });
  return res.data;
};
