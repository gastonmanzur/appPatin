import api from './api';

export const getMe = async (token) => {
  const res = await api.get('/usuarios/me', {
    headers: { Authorization: token },
  });
  return res.data;
};

export const updateProfilePicture = async (file, token) => {
  const formData = new FormData();
  formData.append('picture', file);
  const res = await api.put('/usuarios/picture', formData, {
    headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
