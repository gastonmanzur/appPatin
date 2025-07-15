import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores, eliminarPatinador } from '../api/gestionPatinadores';
import { useNavigate } from 'react-router-dom';

const Patinadores = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [patinadores, setPatinadores] = useState([]);

  const fetchPatinadores = async () => {
    try {
      const data = await getTodosLosPatinadores(token);
      setPatinadores(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar patinadores");
    }
  };

  useEffect(() => {
    fetchPatinadores();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar?')) return;

    try {
      await eliminarPatinador(id, token);
      fetchPatinadores();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const handleEditar = (id) => {
    navigate(`/editar-patinador/${id}`);
  };

  const handleVerMas = (id) => {
    navigate(`/patinador/${id}`);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Listado de Patinadores</h2>
      <div className="row">
        {patinadores.map(p => (
          <div key={p._id} className="col-12 col-sm-6 col-lg-4 mb-4">
            <div className="card h-100 text-center">
              {p.fotoRostro && (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'https://apppatin-1.onrender.com'}/uploads/${p.fotoRostro}`}
                  alt="Rostro"
                  className="rounded-circle mx-auto mt-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {p.primerNombre} {p.apellido}
                </h5>
                <p className="card-text">Categoría: {p.categoria}</p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEditar(p._id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleEliminar(p._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleVerMas(p._id)}
                  >
                    Más info
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patinadores;
