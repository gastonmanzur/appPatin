import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getRankingGeneral } from '../api/ranking';

const RankingGeneral = () => {
  const { token } = useAuth();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRankingGeneral(token);
      setRanking(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Ranking General de Patinadores</h2>

      {ranking.length === 0 ? (
        <p>No hay datos aún.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Patinador</th>
              <th>Categoría</th>
              <th>Puntos Acumulados</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.patinador.primerNombre} {item.patinador.apellido}</td>
                <td>{item.patinador.categoria}</td>
                <td>{item.puntos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RankingGeneral;
