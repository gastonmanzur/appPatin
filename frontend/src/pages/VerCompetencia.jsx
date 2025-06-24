import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarCompetencias } from '../api/competencias';
import { useParams, useNavigate } from 'react-router-dom';

const VerCompetencia = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [competencia, setCompetencia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);
      setCompetencia(comp);
    };
    fetchData();
  }, []);

  if (!competencia) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{competencia.nombre}</h2>
      <p><strong>Fecha:</strong> {new Date(competencia.fecha).toLocaleDateString()}</p>
      {competencia.descripcion && (
        <p><strong>Descripción:</strong> {competencia.descripcion}</p>
      )}
      <button className="btn btn-primary" onClick={() => navigate(`/competencias/${id}/resultados`)}>
        Cargar Resultados
      </button>
      <button className="btn btn-secondary ms-2" onClick={() => navigate(`/competencias/${id}/lista-buena-fe`)}>
        Ver Lista Buena Fe
      </button>
    </div>
  );
};

export default VerCompetencia;
