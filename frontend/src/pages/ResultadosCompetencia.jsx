import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { agregarResultados, listarCompetencias } from '../api/competencias';
import { useParams, useNavigate } from 'react-router-dom';

const ResultadosCompetencia = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [patinadores, setPatinadores] = useState([]);
  const [competencia, setCompetencia] = useState(null);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const pats = await getTodosLosPatinadores(token);
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);

      setPatinadores(pats);
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
    <div>
      <h2>Cargar Resultados de: {competencia?.nombre}</h2>

      <form onSubmit={handleSubmit}>
        {resultados.map((res, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <select
              value={res.patinador}
              onChange={e => handleChange(index, 'patinador', e.target.value)}
            >
              <option value="">Seleccionar Patinador</option>
              {patinadores.map(p => (
                <option key={p._id} value={p._id}>
                  {p.primerNombre} {p.apellido} - {p.categoria} - {p.club}
                </option>
              ))}
            </select>

            {!res.patinador && (
              <>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={res.nombre}
                  onChange={e => handleChange(index, 'nombre', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Club"
                  value={res.club}
                  onChange={e => handleChange(index, 'club', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  value={res.categoria}
                  onChange={e => handleChange(index, 'categoria', e.target.value)}
                  required
                />
              </>
            )}

            <input
              type="number"
              placeholder="Posición"
              value={res.posicion}
              onChange={e => handleChange(index, 'posicion', e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Puntos"
              value={res.puntos}
              onChange={e => handleChange(index, 'puntos', e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={agregarPatinador}>Agregar Resultado</button>
        <br /><br />
        <button type="submit">Guardar Resultados</button>
      </form>
    </div>
  );
};

export default ResultadosCompetencia;
