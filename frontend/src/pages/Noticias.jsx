import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { getNoticias } from '../api/news';

const Noticias = () => {
  const { token } = useAuth();
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await getNoticias(token);
        setNoticias(data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar noticias");
      }
    };

    fetchNoticias();
  }, [token]);

  return (
    <div>
      <h2 className="mb-4">Noticias</h2>

      {noticias.length === 0 && <p>No hay noticias disponibles.</p>}

      <div className="row">
        {noticias.map(noticia => (
          <div key={noticia._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {noticia.imagen && (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'https://backend-app-s246.onrender.com'}/uploads/${noticia.imagen}`}
                  className="card-img-top"
                  alt="Imagen noticia"
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{noticia.titulo}</h5>
                <p className="card-text">
                  {noticia.contenido.length > 120
                    ? `${noticia.contenido.substring(0, 120)}...`
                    : noticia.contenido}
                </p>
                <div className="mt-auto">
                  <Link to={`/noticia/${noticia._id}`} className="btn btn-primary">
                    Más info
                  </Link>
                </div>
              </div>
              <div className="card-footer">
                <small className="text-muted">
                  Por: {noticia.autor.nombre} {noticia.autor.apellido} -{' '}
                  {new Date(noticia.fecha).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noticias;
