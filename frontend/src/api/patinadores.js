import api from './api';

// Asociar patinadores por DNI
export const asociarPatinador = async (dni, token) => {
  const res = await api.post('/patinadores/asociar', { dniBuscado: dni }, {
    headers: { Authorization: token }
  });
  return res.data;
};

// Obtener patinadores asociados
export const getMisPatinadores = async (token) => {
  const res = await api.get('/patinadores/mis-patinadores', {
    headers: { Authorization: token }
  });
  return res.data;
};
