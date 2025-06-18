import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getNoticias } from '../api/news';

const Dashboard = () => {
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
      <h2>Últimas Noticias</h2>

      {noticias.length === 0 && <p>No hay noticias disponibles.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {noticias.map(noticia => (
          <li key={noticia._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 15 }}>
            <h3>{noticia.titulo}</h3>
            <p>{noticia.contenido}</p>

            {noticia.imagen && (
              <div>
                <img 
                  src={`http://localhost:5000/uploads/${noticia.imagen}`} 
                  alt="Imagen noticia" 
                  style={{ maxWidth: '100%', maxHeight: '300px' }} 
                />
              </div>
            )}

            <small>Por: {noticia.autor.nombre} {noticia.autor.apellido} - {new Date(noticia.fecha).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
