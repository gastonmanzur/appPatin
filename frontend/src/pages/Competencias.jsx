import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarCompetencias } from '../api/competencias';
import { useNavigate } from 'react-router-dom';

const Competencias = () => {
  const { token } = useAuth();
  const [competencias, setCompetencias] = useState([]);
  const navigate = useNavigate();

  const fetchCompetencias = async () => {
    try {
      const data = await listarCompetencias(token);
      setCompetencias(data);
    } catch (err) {
      console.error(err);
      alert("Error al obtener competencias");
    }
  };

  useEffect(() => {
    fetchCompetencias();
  }, []);

  const handleResultados = (id) => {
    navigate(`/competencias/${id}/resultados`);
  };

  return (
    <div>
      <h2>Competencias</h2>
      <ul className="list-group">
        {competencias.map(c => (
          <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>{c.nombre}</strong> - {new Date(c.fecha).toLocaleDateString()}</span>
            <div>
              <button className="btn btn-sm btn-secondary me-2" onClick={() => handleResultados(c._id)}>Cargar Resultados</button>
              <button className="btn btn-sm btn-primary" onClick={() => navigate(`/competencias/${c._id}/detalle`)}>Ver Resultados</button>
            </div>
          </li>

        ))}
      </ul>
    </div>
  );
};

export default Competencias;
