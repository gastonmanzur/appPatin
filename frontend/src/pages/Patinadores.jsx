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
    <div
      className={`container${
        patinadores.length === 1
          ? ' d-flex align-items-center justify-content-center min-vh-100'
          : ''
      }`}
    >
      <h2 className="mb-4 text-center w-100">Listado de Patinadores</h2>
      <div
        className={`row${
          patinadores.length > 1
            ? ' row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'
            : ''
        }`}
      >
        {patinadores.map(p => (
          <div key={p._id} className={patinadores.length > 1 ? 'col' : ''}>
            <div className="card h-100 flex-md-row min-vh-100">
              {p.fotoRostro && (
                <img
                  src={`http://localhost:5000/uploads/${p.fotoRostro}`}
                  alt="Rostro"
                  className="rounded-circle m-3"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
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
