import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../store/useAuth';
import formatDate from '../utils/formatDate';
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
    <div className="container my-4">
      <h2 className="mb-4">Títulos Individuales</h2>
      {titulosIndividuales.length === 0 && <p>No hay títulos individuales.</p>}
      {titulosIndividuales.length > 0 && (
        <div className="row">
          {titulosIndividuales.map(t => (
            <div key={t._id} className="col-12 col-sm-6 col-lg-4 mb-4">
              <div className="card h-100">
                {t.imagen && (
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${t.imagen}`}
                    alt="img"
                    className="card-img-top"
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{t.titulo}</h5>
                  <p className="card-text mb-1">
                    {t.patinador?.primerNombre} {t.patinador?.apellido}
                  </p>
                  <p className="card-text mb-2">
                    {t.torneo} ({formatDate(t.fecha)})
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/titulos/individual/editar/${t._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarIndividual(t._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-5">Títulos de Club</h2>
      {titulosClub.length === 0 && <p>No hay títulos de club.</p>}
      {titulosClub.length > 0 && (
        <div className="row">
          {titulosClub.map(t => (
            <div key={t._id} className="col-12 col-sm-6 col-lg-4 mb-4">
              <div className="card h-100">
                {t.imagen && (
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${t.imagen}`}
                    alt="img"
                    className="card-img-top"
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{t.titulo}</h5>
                  <p className="card-text mb-2">{t.torneo}</p>
                  <p className="card-text mb-2">
                    {formatDate(t.fecha)}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/titulos/club/editar/${t._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarClub(t._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Titulos;
