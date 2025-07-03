import React, { useState, useEffect } from 'react';
import useAuth from '../store/useAuth';
import { asociarPatinador, getMisPatinadores } from '../api/patinadores';
import { listarTitulosIndividuales } from '../api/titulos';

const MisPatinadores = () => {
  const { token } = useAuth();
  const [dni, setDni] = useState('');
  const [patinadores, setPatinadores] = useState([]);
  const [titulos, setTitulos] = useState([]);

  const fetchPatinadores = async () => {
    try {
      const data = await getMisPatinadores(token);
      setPatinadores(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar patinadores");
    }
  };

  const fetchTitulos = async () => {
    try {
      const data = await listarTitulosIndividuales(token);
      setTitulos(data);
    } catch (err) {
      console.error(err);
      alert('Error al cargar titulos');
    }
  };

  useEffect(() => {
    fetchPatinadores();
    fetchTitulos();
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
    <div className="container my-4">
      <h2 className="mb-4">Mis Patinadores</h2>

      {patinadores.length === 0 && (
        <div className="card p-3">
          <p className="mb-2">No tienes patinadores asociados.</p>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="DNI para asociar"
              value={dni}
              onChange={e => setDni(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAsociar}>
              Asociar Patinadores
            </button>
          </div>
        </div>
      )}

      {patinadores.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {patinadores.map(p => {
            const misTitulos = titulos.filter(t => t.patinador?._id === p._id);
            return (
              <div key={p._id} className="col">
                <div className="card h-100">
                  {p.foto && (
                    <img
                      src={`http://localhost:5000/uploads/${p.foto}`}
                      alt="Foto"
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      {p.primerNombre} {p.apellido}
                    </h5>
                    <p className="card-text mb-1">Edad: {p.edad}</p>
                    <p className="card-text mb-1">Categoría: {p.categoria}</p>
                    <h6 className="mt-3">Títulos personales</h6>
                    <ul className="mb-0">
                      {misTitulos.length > 0 ? (
                        misTitulos.map(t => (
                          <li key={t._id}>
                            {t.titulo} - {t.torneo} ({
                              new Date(t.fecha).toLocaleDateString()
                            })
                          </li>
                        ))
                      ) : (
                        <li>No posee títulos</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisPatinadores;
