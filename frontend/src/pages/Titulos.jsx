import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../store/useAuth';
import {
  listarTitulosIndividuales,
  listarTitulosClub,
  eliminarTituloIndividual,
  eliminarTituloClub
} from '../api/titulos';

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

  const handleEliminarIndividual = async id => {
    if (!window.confirm('¿Eliminar título?')) return;
    try {
      await eliminarTituloIndividual(id, token);
      setTitulosIndividuales(titulosIndividuales.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const handleEliminarClub = async id => {
    if (!window.confirm('¿Eliminar título?')) return;
    try {
      await eliminarTituloClub(id, token);
      setTitulosClub(titulosClub.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h2>Títulos Individuales</h2>
      <ul>
        {titulosIndividuales.map(t => (
          <li key={t._id}>
            {t.imagen && (
              <img src={`http://localhost:5000/uploads/${t.imagen}`} alt="img" width="50" className="me-2" />
            )}
            {t.patinador?.primerNombre} {t.patinador?.apellido} - {t.titulo} - {t.torneo} ({new Date(t.fecha).toLocaleDateString()})
            {' '}
            <Link to={`/titulos/individual/editar/${t._id}`}>Editar</Link>
            {' | '}
            <button type="button" onClick={() => handleEliminarIndividual(t._id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h2>Títulos de Club</h2>
      <ul>
        {titulosClub.map(t => (
          <li key={t._id}>
            {t.imagen && (
              <img src={`http://localhost:5000/uploads/${t.imagen}`} alt="img" width="50" className="me-2" />
            )}
            {t.titulo} - {t.torneo} ({new Date(t.fecha).toLocaleDateString()})
            {' '}
            <Link to={`/titulos/club/editar/${t._id}`}>Editar</Link>
            {' | '}
            <button type="button" onClick={() => handleEliminarClub(t._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Titulos;
