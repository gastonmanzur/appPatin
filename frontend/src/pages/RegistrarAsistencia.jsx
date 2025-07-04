import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import {
  crearAsistencia,
  listarAsistencias,
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerAsistencia
} from '../api/asistencias';

const RegistrarAsistencia = () => {
  const { token } = useAuth();
  const [asistencias, setAsistencias] = useState([]);
  const [patinadores, setPatinadores] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [fecha, setFecha] = useState('');
  const [editId, setEditId] = useState(null);
  const [modoFormulario, setModoFormulario] = useState(false);

  const cargarAsistencias = async () => {
    try {
      const data = await listarAsistencias(token);
      setAsistencias(data);
    } catch (err) {
      console.error(err);
      alert('Error al obtener asistencias');
    }
  };

  useEffect(() => {
    cargarAsistencias();
  }, [token]);

  const iniciarCrear = async () => {
    const pats = await getTodosLosPatinadores(token);
    setPatinadores(pats);
    setDetalles(pats.map(p => ({ patinador: p._id, presente: true })));
    setFecha(new Date().toISOString().substring(0,10));
    setEditId(null);
    setModoFormulario(true);
  };

  const handleCheck = (index, presente) => {
    setDetalles(prev => {
      const arr = [...prev];
      arr[index].presente = presente;
      return arr;
    });
  };

  const handleGuardar = async () => {
    try {
      const payload = { fecha, detalles };
      if (editId) {
        await actualizarAsistencia(editId, payload, token);
      } else {
        await crearAsistencia(payload, token);
      }
      setModoFormulario(false);
      cargarAsistencias();
    } catch (err) {
      console.error(err);
      alert('Error al guardar asistencia');
    }
  };

  const handleEditar = async (id) => {
    try {
      const data = await obtenerAsistencia(id, token);
      setPatinadores(data.detalles.map(d => d.patinador));
      setDetalles(data.detalles.map(d => ({ patinador: d.patinador._id, presente: d.presente })));
      setFecha(data.fecha.substring(0,10));
      setEditId(id);
      setModoFormulario(true);
    } catch (err) {
      console.error(err);
      alert('Error al cargar asistencia');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar asistencia?')) return;
    try {
      await eliminarAsistencia(id, token);
      cargarAsistencias();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar asistencia');
    }
  };

  if (modoFormulario) {
    return (
      <div className="container my-4">
        <h2>{editId ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}</h2>
        <div className="mb-3">
          <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Patinador</th>
                <th>Presente</th>
                <th>Ausente</th>
              </tr>
            </thead>
            <tbody>
              {patinadores.map((p, idx) => (
                <tr key={p._id}>
                  <td>{p.primerNombre} {p.apellido}</td>
                  <td>
                    <input type="radio" name={`estado-${idx}`} checked={detalles[idx].presente} onChange={() => handleCheck(idx, true)} />
                  </td>
                  <td>
                    <input type="radio" name={`estado-${idx}`} checked={!detalles[idx].presente} onChange={() => handleCheck(idx, false)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary me-2" onClick={handleGuardar}>Guardar</button>
        <button className="btn btn-secondary" onClick={() => setModoFormulario(false)}>Cancelar</button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2>Registrar Asistencia</h2>
      <button className="btn btn-primary mb-3" onClick={iniciarCrear}>Crear Entrenamiento</button>
      <ul className="list-group">
        {asistencias.map(a => (
          <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
            {new Date(a.fecha).toLocaleDateString()}
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(a._id)}>Ver/Editar</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(a._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrarAsistencia;
