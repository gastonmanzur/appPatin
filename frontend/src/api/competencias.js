import api from './api';

// Crear nueva competencia
export const crearCompetencia = async (data, token) => {
  const res = await api.post('/competencias', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

// Listar competencias
export const listarCompetencias = async (token) => {
  const res = await api.get('/competencias', {
    headers: { Authorization: token }
  });
  return res.data;
};

// Agregar resultados
export const agregarResultados = async (data, token) => {
  const res = await api.put('/competencias/resultados', data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const agregarResultadosClub = async (data, token) => {
  const res = await api.put('/competencias/resultados-club', data, {
    headers: { Authorization: token }
  });
  return res.data;
};
