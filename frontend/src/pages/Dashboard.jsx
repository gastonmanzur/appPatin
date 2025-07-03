import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getFotos } from '../api/fotos';
import MisPatinadores from './MisPatinadores';
import FotoCarousel from '../components/FotoCarousel';

const Dashboard = () => {
  const { token } = useAuth();
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

      <MisPatinadores />
    </div>
  );
};

export default Dashboard;
