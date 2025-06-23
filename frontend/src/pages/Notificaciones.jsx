import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import useNotifications from '../store/useNotifications';
import { getNotificaciones, marcarLeida } from '../api/notificaciones';
import { confirmarCompetencia } from '../api/competencias';

const Notificaciones = () => {
  const { token } = useAuth();
  const { setUnread } = useNotifications();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificaciones(token);
        setNotificaciones(data);
        setUnread(data.filter(n => !n.leida).length);
      } catch (err) {
        console.error(err);
        alert('Error al cargar notificaciones');
      }
    };
    fetchData();
  }, [token, setUnread]);

  const marcarComoLeida = async (id, index) => {
    try {
      await marcarLeida(id, token);
      setNotificaciones(n => {
        const arr = [...n];
        arr[index].leida = true;
        return arr;
      });
      setUnread(u => Math.max(u - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmar = async (competenciaId, resp) => {
    try {
      await confirmarCompetencia(competenciaId, resp, token);
      alert('Respuesta registrada');
    } catch (err) {
      console.error(err);
      alert('Error al confirmar');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Notificaciones</h2>
      {notificaciones.length === 0 ? (
        <p>No hay notificaciones.</p>
      ) : (
        <ul className="list-group">
          {notificaciones.map((n, idx) => (
            <li
              key={n._id}
              className="list-group-item"
              onClick={() => !n.leida && marcarComoLeida(n._id, idx)}
            >
              <div className={n.leida ? '' : 'fw-bold'}>{n.mensaje}</div>
              <small className="text-muted">
                {new Date(n.fecha).toLocaleString()}
              </small>
              {n.competencia && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmar(n.competencia._id, 'SI');
                    }}
                  >
                    Asistir
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmar(n.competencia._id, 'NO');
                    }}
                  >
                    No asistir
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notificaciones;
