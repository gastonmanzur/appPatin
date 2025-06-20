import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarCompetencias } from '../api/competencias';
import { useParams } from 'react-router-dom';

const ResultadosDetalle = () => {
  const { token } = useAuth();
  const { id } = useParams();

  const [competencia, setCompetencia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);
      setCompetencia(comp);
    };

    fetchData();
  }, []);

  const getMedalla = (pos) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '';
  };

  if (!competencia) return <p>Cargando...</p>;

  const resultadosOrdenados = [...competencia.resultados].sort((a, b) => a.posicion - b.posicion);

  return (
    <div>
      <h2>Resultados de: {competencia.nombre}</h2>
      <p>Fecha: {new Date(competencia.fecha).toLocaleDateString()}</p>

      {resultadosOrdenados.length === 0 ? (
        <p>No hay resultados cargados aún.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Patinador</th>
              <th>Categoría</th>
              <th>Puntos</th>
              <th>Podio</th>
            </tr>
          </thead>
          <tbody>
            {resultadosOrdenados.map((res, index) => (
              <tr key={index}>
                <td>{res.posicion}</td>
                <td>{res.patinador?.primerNombre} {res.patinador?.apellido}</td>
                <td>{res.patinador?.categoria}</td>
                <td>{res.puntos}</td>
                <td>{getMedalla(res.posicion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultadosDetalle;
