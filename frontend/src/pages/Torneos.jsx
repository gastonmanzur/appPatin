import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTorneos } from '../api/torneos';
import { useNavigate } from 'react-router-dom';
import formatDate from '../utils/formatDate';

const Torneos = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarTorneos(token);
        setTorneos(data);
      } catch (err) {
        console.error(err);
        alert('Error al obtener torneos');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Torneos</h2>
      <ul className="list-group">
        {torneos.map(t => (
          <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{t.nombre}</strong>
              {t.fechaInicio ? ` - ${formatDate(t.fechaInicio)}` : ''}
              {` (${t.tipo})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Torneos;
