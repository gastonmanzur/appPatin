import api from './api';

export const crearNoticia = async (noticia, token) => {
  const formData = new FormData();
  formData.append('titulo', noticia.titulo);
  formData.append('contenido', noticia.contenido);
  if (noticia.imagen) formData.append('imagen', noticia.imagen);

  const res = await api.post('/news', formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const getNoticias = async (token) => {
  const res = await api.get('/news', {
    headers: { Authorization: token }
  });
  return res.data;
};
