import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { agregarResultadosClub, listarCompetencias } from '../api/competencias';
import { useParams, useNavigate } from 'react-router-dom';

const ResultadosClubCompetencia = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [competencia, setCompetencia] = useState(null);
  const [resultadosClub, setResultadosClub] = useState([{ club: '', puntos: '' }]);

  useEffect(() => {
    const fetchData = async () => {
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);
      setCompetencia(comp);
    };
    fetchData();
  }, []);

  const agregarClub = () => {
    setResultadosClub([...resultadosClub, { club: '', puntos: '' }]);
  };

  const handleChange = (index, field, value) => {
    const nuevos = [...resultadosClub];
    nuevos[index][field] = value;
    setResultadosClub(nuevos);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await agregarResultadosClub({ competenciaId: id, resultadosClub }, token);
      alert("Resultados de clubes guardados");
      navigate('/competencias');
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div>
      <h2>Resultados de Clubes - {competencia?.nombre}</h2>

      <form onSubmit={handleSubmit}>
        {resultadosClub.map((res, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Nombre del club"
              value={res.club}
              onChange={e => handleChange(index, 'club', e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Puntos"
              value={res.puntos}
              onChange={e => handleChange(index, 'puntos', e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={agregarClub}>Agregar Club</button>
        <br /><br />
        <button type="submit">Guardar Resultados</button>
      </form>
    </div>
  );
};

export default ResultadosClubCompetencia;
