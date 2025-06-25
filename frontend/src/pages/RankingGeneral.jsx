import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getRankingGeneral } from '../api/ranking';

const RankingGeneral = () => {
  const { token } = useAuth();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRankingGeneral(token);
        setRanking(data);
      } catch (e) {
        console.error('Error fetching ranking', e);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Ranking General de Clubes</h2>

      {ranking.length === 0 ? (
        <p>No hay datos aún.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Club</th>
              <th>Puntos Acumulados</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.club}</td>
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
