import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTitulosClub } from '../api/titulos';
import MisPatinadores from './MisPatinadores';

const Dashboard = () => {
  const { token } = useAuth();
  const [titulos, setTitulos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarTitulosClub(token);
        setTitulos(data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar títulos');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <div className="row mb-4">
        {titulos.map(t => (
          <div key={t._id} className="col-md-4 mb-3">
            <div className="card bg-dark text-white">
              <img
                src="/vite.svg"
                className="card-img"
                alt="Título"
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end">
                <h5 className="card-title">{t.titulo}</h5>
                <p className="card-text">
                  {t.torneo}
                  {t.posicion ? ` - Posición ${t.posicion}` : ''}
                </p>
                <p className="card-text">
                  <small>{new Date(t.fecha).toLocaleDateString()}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MisPatinadores />
    </div>
  );
};

export default Dashboard;
