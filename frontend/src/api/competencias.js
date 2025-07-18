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

export const editarCompetencia = async (id, data, token) => {
  const res = await api.put(`/competencias/${id}`, data, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const eliminarCompetencia = async (id, token) => {
  const res = await api.delete(`/competencias/${id}`, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const confirmarCompetencia = async (id, respuesta, token) => {
  const res = await api.post(`/competencias/${id}/confirmar`, { respuesta }, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const obtenerListaBuenaFe = async (id, token) => {
  const res = await api.get(`/competencias/${id}/lista-buena-fe`, {
    headers: { Authorization: token }
  });
  return res.data;
};

export const descargarListaBuenaFeExcel = async (id, token) => {
  const res = await api.get(`/competencias/${id}/lista-buena-fe/excel`, {
    headers: { Authorization: token },
    responseType: 'blob'
  });
  return res.data;
};

export const agregarPatinadorLBF = async (id, patinadorId, token) => {
  const res = await api.post(
    `/competencias/${id}/lista-buena-fe/manual`,
    { patinadorId },
    { headers: { Authorization: token } }
  );
  return res.data;
};

export const actualizarBajaLBF = async (id, patinadorId, baja, token) => {
  const res = await api.put(
    `/competencias/${id}/lista-buena-fe/manual/${patinadorId}`,
    { baja },
    { headers: { Authorization: token } }
  );
  return res.data;
};
