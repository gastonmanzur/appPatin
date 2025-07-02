import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { obtenerListaBuenaFe, listarCompetencias, descargarListaBuenaFeExcel, agregarPatinadorLBF, actualizarBajaLBF } from '../api/competencias';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useParams } from 'react-router-dom';

const ListaBuenaFe = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [lista, setLista] = useState([]);
  const [competencia, setCompetencia] = useState(null);
  const [todos, setTodos] = useState([]);
  const [seleccion, setSeleccion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, comps, pats] = await Promise.all([
          obtenerListaBuenaFe(id, token),
          listarCompetencias(token),
          getTodosLosPatinadores(token)
        ]);
        setLista(data);
        const comp = comps.find(c => c._id === id);
        setCompetencia(comp);
        setTodos(pats);
      } catch (err) {
        console.error(err);
        alert('Error al cargar lista de buena fe');
      }
    };
    fetchData();
  }, []);

  const handleSeguro = (index, value) => {
    setLista(l => {
      const arr = [...l];
      arr[index].tipoSeguro = value;
      return arr;
    });
  };

  const exportarExcel = async () => {
    try {
      const blob = await descargarListaBuenaFeExcel(id, token);
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lista_buena_fe.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error al exportar a Excel');
    }
  };

  const handleAgregar = async () => {
    if (!seleccion) return;
    try {
      await agregarPatinadorLBF(id, seleccion, token);
      const data = await obtenerListaBuenaFe(id, token);
      setLista(data);
      setSeleccion('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error al agregar');
    }
  };

  const toggleBaja = async (patinadorId, bajaActual) => {
    try {
      await actualizarBajaLBF(id, patinadorId, !bajaActual, token);
      setLista(l => l.map(p => (p._id === patinadorId ? { ...p, baja: !bajaActual } : p)));
    } catch (err) {
      console.error(err);
      alert('Error al actualizar');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Buena Fe</h2>
      {lista.length === 0 ? (
        <p>No hay patinadores confirmados aún.</p>
      ) : (
        <>
        <div className="mb-3 d-flex">
          <select
            className="form-select me-2"
            value={seleccion}
            onChange={e => setSeleccion(e.target.value)}
          >
            <option value="">Agregar patinador...</option>
            {todos
              .filter(p => !lista.some(l => l._id === p._id))
              .map(p => (
                <option key={p._id} value={p._id}>
                  {p.apellido} {p.primerNombre}
                </option>
              ))}
          </select>
          <button className="btn btn-primary" onClick={handleAgregar}>
            Agregar
          </button>
          <button className="btn btn-success ms-auto" onClick={exportarExcel}>
            Exportar a Excel
          </button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>N°</th>
              <th>Seguro</th>
              <th>N° Patinador</th>
              <th>Nombre Completo</th>
              <th>Categoría</th>
              <th>Club</th>
              <th>Fecha Nacimiento</th>
              <th>DNI</th>
              <th>Club Organizador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p, idx) => (
              <tr key={p._id} style={{ backgroundColor: p.baja ? '#f8d7da' : 'white' }}>
                <td>{idx + 1}</td>
                <td>
                  <select
                    value={p.tipoSeguro}
                    onChange={e => handleSeguro(idx, e.target.value)}
                  >
                    <option value="SA">SA</option>
                    <option value="SD">SD</option>
                  </select>
                </td>
                <td>{p.numeroCorredor || '-'}</td>
                <td>{`${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim()}</td>
                <td>{p.categoria}</td>
                <td>{p.club}</td>
                <td>{new Date(p.fechaNacimiento).toLocaleDateString()}</td>
                <td>{p.dni}</td>
                <td>{competencia?.clubOrganizador || ''}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => toggleBaja(p._id, p.baja)}>
                    {p.baja ? 'Revertir' : 'Dar de baja'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

export default ListaBuenaFe;
