import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTitulosClub } from '../api/titulos';
import { getFotos } from '../api/fotos';
import MisPatinadores from './MisPatinadores';
import FotoCarousel from '../components/FotoCarousel';

const Dashboard = () => {
  const { token } = useAuth();
  const [titulos, setTitulos] = useState([]);
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarTitulosClub(token);
        setTitulos(data);
        const imgs = await getFotos(token);
        setFotos(imgs);
      } catch (err) {
        console.error(err);
        alert('Error al cargar títulos');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div>
      {fotos.length > 0 && (
        <div className="mb-4">
          <FotoCarousel fotos={fotos} />
        </div>
      )}
      <div className="mb-4">
        <div id="titulosCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {titulos.map((t, idx) => (
              <div key={t._id} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                <div className="card bg-dark text-white">
                  <img
                    src={
                      t.imagen
                        ? `http://localhost:5000/uploads/${t.imagen}`
                        : '/vite.svg'
                    }
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
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#titulosCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#titulosCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      <MisPatinadores />
    </div>
  );
};

export default Dashboard;
