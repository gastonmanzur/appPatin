import React, { useState, useEffect } from 'react';
import useAuth from '../store/useAuth';
import { asociarPatinador, getMisPatinadores } from '../api/patinadores';

const MisPatinadores = () => {
  const { token } = useAuth();
  const [dni, setDni] = useState('');
  const [patinadores, setPatinadores] = useState([]);

  const fetchPatinadores = async () => {
    try {
      const data = await getMisPatinadores(token);
      setPatinadores(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar patinadores");
    }
  };

  useEffect(() => {
    fetchPatinadores();
  }, []);

  const handleAsociar = async () => {
    if (!dni) return alert('Debes ingresar un DNI');

    try {
      await asociarPatinador(dni, token);
      alert("Patinadores asociados correctamente");
      setDni('');
      fetchPatinadores();
    } catch (err) {
      console.error(err);
      alert(err.response.data.msg || "Error al asociar patinador");
    }
  };

  return (
    <div>
      <h2>Mis Patinadores</h2>

      {patinadores.length === 0 && (
        <div>
          <p>No tienes patinadores asociados.</p>
          <input type="text" placeholder="DNI para asociar" value={dni} onChange={e => setDni(e.target.value)} />
          <button onClick={handleAsociar}>Asociar Patinadores</button>
        </div>
      )}

      {patinadores.length > 0 && (
        <>
          <h3>Patinadores asociados:</h3>
          <ul>
            {patinadores.map(p => (
              <li key={p._id}>
                <strong>{p.primerNombre} {p.apellido}</strong> - {p.categoria}
                {p.fotoRostro && (
                  <div>
                    <img src={`http://localhost:5000/uploads/${p.fotoRostro}`} alt="Rostro" width={150} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MisPatinadores;
