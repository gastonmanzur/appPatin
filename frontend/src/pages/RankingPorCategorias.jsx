import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getRankingPorCategorias } from '../api/ranking';

const RankingPorCategorias = () => {
  const { token } = useAuth();
  const [rankings, setRankings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRankingPorCategorias(token);
        setRankings(data);
      } catch (e) {
        console.error('Error fetching ranking por categorias', e);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Ranking por Categorías</h2>

      {Object.keys(rankings).length === 0 ? (
        <p>No hay datos aún.</p>
      ) : (
        Object.keys(rankings).sort().map((categoria) => (
          <div key={categoria} className="mb-4">
            <h3>Categoría: {categoria}</h3>
            <table className="table table-striped mt-2">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Patinador</th>
                  <th>Puntos Acumulados</th>
                </tr>
              </thead>
              <tbody>
                {rankings[categoria].map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.patinador.primerNombre} {item.patinador.apellido}</td>
                    <td>{item.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default RankingPorCategorias;
