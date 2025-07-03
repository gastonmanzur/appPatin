import api from './api';

export const subirFoto = async (file, token) => {
  const formData = new FormData();
  formData.append('imagen', file);
  const res = await api.post('/fotos', formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const getFotos = async (token) => {
  const res = await api.get('/fotos', {
    headers: { Authorization: token }
  });
  return res.data;
};
