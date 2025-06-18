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
    <div>
      <h2>Listado de Patinadores</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {patinadores.map(p => (
          <li key={p._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 15, display: 'flex', alignItems: 'center' }}>
            
            {p.fotoRostro && (
              <img 
                src={`http://localhost:5000/uploads/${p.fotoRostro}`} 
                alt="Rostro" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: 15, borderRadius: '50%' }} 
              />
            )}

            <div style={{ flex: 1 }}>
              <strong>{p.primerNombre} {p.apellido}</strong> - Categoría: {p.categoria}
              <div>
                <button onClick={() => handleEditar(p._id)}>Editar</button>
                <button onClick={() => handleEliminar(p._id)}>Eliminar</button>
                <button onClick={() => handleVerMas(p._id)}>Más info</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Patinadores;
