import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getNotificaciones } from '../api/notificaciones';

const Notificaciones = () => {
  const { token } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificaciones(token);
        setNotificaciones(data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar notificaciones');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="container">
      <h2 className="mb-4">Notificaciones</h2>
      {notificaciones.length === 0 ? (
        <p>No hay notificaciones.</p>
      ) : (
        <ul className="list-group">
          {notificaciones.map(n => (
            <li key={n._id} className="list-group-item">
              <div>{n.mensaje}</div>
              <small className="text-muted">{new Date(n.fecha).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificaciones;
