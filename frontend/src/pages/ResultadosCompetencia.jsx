import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { agregarResultados, listarCompetencias, obtenerListaBuenaFe } from '../api/competencias';
import { useParams, useNavigate } from 'react-router-dom';

const ResultadosCompetencia = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [patinadores, setPatinadores] = useState([]);
  const [competencia, setCompetencia] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [filtroNumero, setFiltroNumero] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const lista = await obtenerListaBuenaFe(id, token);
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);

      setPatinadores(lista);
      setCompetencia(comp);
      setResultados([]);
    };

    fetchData();
  }, []);

  const agregarPatinador = () => {
    setResultados([...resultados, { patinador: '', nombre: '', club: '', categoria: '', posicion: '', puntos: '' }]);
  };

  const handleChange = (index, field, value) => {
    const nuevos = [...resultados];
    nuevos[index][field] = value;
    setResultados(nuevos);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await agregarResultados({ competenciaId: id, resultados }, token);
      alert("Resultados guardados");
      navigate('/competencias');
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Cargar Resultados de: {competencia?.nombre}
              </h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filtrar por número de patinador"
                  value={filtroNumero}
                  onChange={e => setFiltroNumero(e.target.value)}
                />
              </div>

              <form onSubmit={handleSubmit}>
                {resultados.map((res, index) => (
                  <div key={index} className="row g-2 align-items-end mb-3">
                    <div className="col-12 col-md-4">
                      <select
                        className="form-select"
                        value={res.patinador}
                        onChange={e => handleChange(index, 'patinador', e.target.value)}
                      >
                        <option value="">Seleccionar Patinador</option>
                        {patinadores
                          .filter(p =>
                            p.numeroCorredor
                              ?.toString()
                              .includes(filtroNumero)
                          )
                          .map(p => (
                            <option key={p._id} value={p._id}>
                              {p.primerNombre} {p.apellido} - {p.categoria} - {p.club}
                            </option>
                          ))}
                      </select>
                    </div>

                    {!res.patinador && (
                      <>
                        <div className="col-12 col-md">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nombre"
                            value={res.nombre}
                            onChange={e => handleChange(index, 'nombre', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Club"
                            value={res.club}
                            onChange={e => handleChange(index, 'club', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Categoría"
                            value={res.categoria}
                            onChange={e => handleChange(index, 'categoria', e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="col-6 col-md-2">
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Posición"
                        value={res.posicion}
                        onChange={e => handleChange(index, 'posicion', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-6 col-md-2">
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Puntos"
                        value={res.puntos}
                        onChange={e => handleChange(index, 'puntos', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between mt-4">
                  <button type="button" className="btn btn-secondary" onClick={agregarPatinador}>
                    Agregar Resultado
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Resultados
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosCompetencia;
