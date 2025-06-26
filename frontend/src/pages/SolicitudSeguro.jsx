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

  const DEFAULTS = {
    nacionalidad: 'Argentina',
    club: 'General Rodriguez',
    funcion: 'patinador',
    codigoPostal: '1748',
    localidad: 'General Rodriguez',
    provincia: 'Bs. As.'
  };

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
    setLista(l => [...l, { ...pat, tipoLicSeg: tipo }]);

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
    const encabezados = [
      'DNI',
      'CUIL',
      'Apellido',
      'Nombres',
      'Fecha Nacimiento',
      'Sexo',
      'Nacionalidad',
      'Club',
      'Funcion',
      'Codigo Postal',
      'Localidad',
      'Provincia',
      'Telefono',
      'Tipo Lic/Seg'
    ];

    const filas = lista.map(p => [
      p.dni,
      p.cuil || '',
      p.apellido,
      `${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
      new Date(p.fechaNacimiento).toLocaleDateString(),
      p.sexo === 'M' ? 1 : 2,
      DEFAULTS.nacionalidad,
      p.club || DEFAULTS.club,
      DEFAULTS.funcion,
      DEFAULTS.codigoPostal,
      DEFAULTS.localidad,
      DEFAULTS.provincia,
      p.telefono || '',
      p.tipoLicSeg
    ]);
    // Algunos Excel utilizan ';' como separador predeterminado
    const csvContent = [encabezados, ...filas]
      .map(row => row.join(';'))
      .join('\n');
    // Incluir BOM para forzar a Excel a reconocer UTF-8
    const csvWithBom = '\uFEFF' + csvContent;
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
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
            <option value="LN">LN</option>
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
                <th>DNI</th>
                <th>CUIL</th>
                <th>Apellido</th>
                <th>Nombres</th>
                <th>Fecha Nac.</th>
                <th>Sexo</th>
                <th>Nacionalidad</th>
                <th>Club</th>
                <th>Función</th>
                <th>Cód. Postal</th>
                <th>Localidad</th>
                <th>Provincia</th>
                <th>Teléfono</th>
                <th>Lic./Seg.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{p.dni}</td>
                  <td>{p.cuil}</td>
                  <td>{p.apellido}</td>
                  <td>{`${p.primerNombre} ${p.segundoNombre || ''}`.trim()}</td>
                  <td>{new Date(p.fechaNacimiento).toLocaleDateString()}</td>
                  <td>{p.sexo === 'M' ? 1 : 2}</td>
                  <td>{DEFAULTS.nacionalidad}</td>
                  <td>{p.club || DEFAULTS.club}</td>
                  <td>{DEFAULTS.funcion}</td>
                  <td>{DEFAULTS.codigoPostal}</td>
                  <td>{DEFAULTS.localidad}</td>
                  <td>{DEFAULTS.provincia}</td>
                  <td>{p.telefono}</td>
                  <td>{p.tipoLicSeg}</td>
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
