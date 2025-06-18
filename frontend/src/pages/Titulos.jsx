import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTitulosIndividuales, listarTitulosClub } from '../api/titulos';

const Titulos = () => {
  const { token } = useAuth();
  const [titulosIndividuales, setTitulosIndividuales] = useState([]);
  const [titulosClub, setTitulosClub] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const individuales = await listarTitulosIndividuales(token);
      const club = await listarTitulosClub(token);
      setTitulosIndividuales(individuales);
      setTitulosClub(club);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Títulos Individuales</h2>
      <ul>
        {titulosIndividuales.map(t => (
          <li key={t._id}>
            {t.patinador?.primerNombre} {t.patinador?.apellido} - {t.titulo} - {t.torneo} ({new Date(t.fecha).toLocaleDateString()})
          </li>
        ))}
      </ul>

      <h2>Títulos de Club</h2>
      <ul>
        {titulosClub.map(t => (
          <li key={t._id}>
            {t.titulo} - {t.torneo} ({new Date(t.fecha).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Titulos;
