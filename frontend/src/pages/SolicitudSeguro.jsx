import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';

const SolicitudSeguro = () => {
  const { token } = useAuth();

  const [patinadores, setPatinadores] = useState([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [tipo, setTipo] = useState('SA');
  const [lista, setLista] = useState([]);
  const [sdCounts, setSdCounts] = useState({});

  useEffect(() => {
    const fetchPatinadores = async () => {
      try {
        const data = await getTodosLosPatinadores(token);
        setPatinadores(data);
      } catch (err) {
        console.error(err);
        alert('Error al cargar patinadores');
      }
    };
    fetchPatinadores();
  }, []);

  useEffect(() => {
    if (seleccionado && sdCounts[seleccionado] >= 2) {
      setTipo('SA');
    }
  }, [seleccionado, sdCounts]);

  const agregar = () => {
    if (!seleccionado) return;
    const pat = patinadores.find(p => p._id === seleccionado);
    if (!pat) return;
    setLista(l => [...l, { ...pat, tipo }]);

    if (tipo === 'SA') {
      setPatinadores(patinadores.filter(p => p._id !== seleccionado));
      setSdCounts(c => {
        const nc = { ...c };
        delete nc[seleccionado];
        return nc;
      });
      setSeleccionado('');
    } else if (tipo === 'SD') {
      setSdCounts(c => ({ ...c, [seleccionado]: (c[seleccionado] || 0) + 1 }));
    }
  };

  const quitar = index => {
    setLista(l => l.filter((_, i) => i !== index));
  };

  const exportarExcel = () => {
    const encabezados = ['Nombre Completo', 'DNI', 'Tipo Seguro', 'Club'];
    const filas = lista.map(p => [
      `${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
      p.dni,
      p.tipo,
      p.club || ''
    ]);
    const csvContent = [encabezados, ...filas]
      .map(row => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitudes_seguros.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-4">
      <h2>Solicitud de Seguros</h2>
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={seleccionado}
            onChange={e => setSeleccionado(e.target.value)}
          >
            <option value="">Seleccione patinador</option>
            {patinadores.map(p => (
              <option key={p._id} value={p._id}>
                {p.apellido} {p.primerNombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="SA">SA</option>
            <option value="SD" disabled={sdCounts[seleccionado] >= 2}>SD</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={agregar}>
            Agregar
          </button>
        </div>
      </div>

      {lista.length > 0 && (
        <>
          <button className="btn btn-success mb-3" onClick={exportarExcel}>
            Exportar a Excel
          </button>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Seguro</th>
                <th>Club</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{`${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim()}</td>
                  <td>{p.dni}</td>
                  <td>{p.tipo}</td>
                  <td>{p.club || ''}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => quitar(idx)}
                    >
                      Quitar
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

export default SolicitudSeguro;
