import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { getNoticia } from '../api/news';

const NoticiaDetalle = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const data = await getNoticia(id, token);
        setNoticia(data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar la noticia');
      }
    };
    fetchNoticia();
  }, [id, token]);

  if (!noticia) return <p>Cargando...</p>;

  return (
    <div className="card">
      {noticia.imagen && (
        <img
          src={`http://localhost:5000/uploads/${noticia.imagen}`}
          className="card-img-top"
          alt="Imagen noticia"
          style={{ objectFit: 'cover', maxHeight: '400px' }}
        />
      )}
      <div className="card-body">
        <h3 className="card-title">{noticia.titulo}</h3>
        <p className="card-text">{noticia.contenido}</p>
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Por: {noticia.autor.nombre} {noticia.autor.apellido} -{' '}
          {new Date(noticia.fecha).toLocaleString()}
        </small>
      </div>
    </div>
  );
};

export default NoticiaDetalle;
