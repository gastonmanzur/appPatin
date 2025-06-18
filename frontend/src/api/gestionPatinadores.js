import api from './api';

export const crearPatinador = async (formData, token) => {
  const res = await api.post('/gestion-patinadores', formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// Obtener todos los patinadores
export const getTodosLosPatinadores = async (token) => {
  const res = await api.get('/gestion-patinadores', {
    headers: { Authorization: token }
  });
  return res.data;
};

// Eliminar patinador
export const eliminarPatinador = async (id, token) => {
  const res = await api.delete(`/gestion-patinadores/${id}`, {
    headers: { Authorization: token }
  });
  return res.data;
};

// Editar patinador
export const editarPatinador = async (id, datos, token) => {
  const res = await api.put(`/gestion-patinadores/${id}`, datos, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const editarPatinadorConImagen = async (id, formData, token) => {
  const res = await api.put(`/gestion-patinadores/${id}`, formData, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};
