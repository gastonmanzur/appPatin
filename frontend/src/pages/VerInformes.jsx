import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { getMisPatinadores } from '../api/patinadores';
import { obtenerInformes } from '../api/informes';

const VerInformes = () => {
  const { token, user } = useAuth();
  const [patinadores, setPatinadores] = useState([]);
  const [seleccion, setSeleccion] = useState('');
  const [informes, setInformes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user.rol === 'Tecnico' || user.rol === 'Delegado') {
          const data = await getTodosLosPatinadores(token);
          setPatinadores(data);
        } else {
          const data = await getMisPatinadores(token);
          setPatinadores(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [token, user]);

  const cargarInformes = async id => {
    try {
      const data = await obtenerInformes(id, token);
      setInformes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = e => {
    const id = e.target.value;
    setSeleccion(id);
    if (id) cargarInformes(id);
    else setInformes([]);
  };

  return (
    <div className="container my-4">
      <h2>Informes</h2>
      <div className="mb-3">
        <select value={seleccion} onChange={handleSelect} className="form-select">
          <option value="">Seleccione un patinador</option>
          {patinadores.map(p => (
            <option key={p._id} value={p._id}>
              {p.primerNombre} {p.apellido}
            </option>
          ))}
        </select>
      </div>
      {informes.map(inf => (
        <div key={inf._id} className="card mb-3">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">
              {new Date(inf.fecha).toLocaleDateString()} - {inf.tecnico?.nombre}{' '}
              {inf.tecnico?.apellido}
            </h6>
            <p className="card-text">{inf.contenido}</p>
          </div>
        </div>
      ))}
      {seleccion && informes.length === 0 && <p>No hay informes.</p>}
    </div>
  );
};

export default VerInformes;
