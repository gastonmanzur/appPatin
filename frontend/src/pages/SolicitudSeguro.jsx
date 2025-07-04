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
    if (lista.some(p => p._id === seleccionado)) {
      alert('El patinador ya está en la lista');
      return;
    }
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

  const exportarExcel = async () => {
    const ExcelJS = (await import('exceljs/dist/exceljs.min.js')).default;
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Solicitud');

    ws.columns = [
      ...new Array(6).fill({ width: 2.89 }),
      { width: 11.22 },
      { width: 13.89 },
      { width: 23.67 },
      { width: 34.89 },
      { width: 11.78 },
      { width: 6.22 },
      { width: 12.67 },
      { width: 18.22 },
      { width: 10.33 },
      { width: 23 },
      { width: 7.56 },
      { width: 15.89 },
      { width: 14.67 },
      { width: 13.11 },
      { width: 18.67 }
    ];

    ws.getRow(2).height = 43.2;

    ws.mergeCells('A2:F2');
    ws.getCell('A2').value = 'NO COMPLETAR ESTAS COLUMNAS';
    ws.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('A2').font = { name: 'Calibri', size: 14, bold: true };
    ws.getCell('A2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0000' }
    };

    ws.mergeCells('G2:K2');
    ws.getCell('G2').value =
      'COMPLETAR CON TODOS LOS APELLIDOS Y NOMBRES COMO FIGURAN EN EL DNI';
    ws.getCell('G2').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('G2').font = { name: 'Calibri', size: 14, bold: true };
    ws.getCell('G2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00B0F0' }
    };

    ws.mergeCells('L2:O2');
    ws.getCell('L2').value =
      'SEXO IDENTIFICAR SOLO CON NUMEROS (1 MASCULINO) - (2 FEMENINO)';
    ws.getCell('L2').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('L2').font = { name: 'Calibri', size: 14, bold: true };
    ws.getCell('L2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00B050' }
    };

    ws.mergeCells('P2:T2');
    ws.getCell('P2').value = 'COMPLETAR SOLO COLUMNAS AMARILLAS';
    ws.getCell('P2').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('P2').font = { name: 'Calibri', size: 14, bold: true };
    ws.getCell('P2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }
    };

    const cU2 = ws.getCell('U2');
    cU2.value = 'SEG. ANUAL O LIC.  PROMOCIONAL O LIC. NACIONAL';
    cU2.alignment = { vertical: 'middle', horizontal: 'center' };
    cU2.font = { name: 'Calibri', size: 11, bold: true };
    cU2.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFA500' }
    };

    const headers = [
      'Seguro',
      'CAP',
      'FA',
      'DNI',
      'FM',
      'Legajo',
      'DNI',
      'CUIL',
      'APELLIDO/S',
      'NOMBRE/S',
      'F.Nac',
      'Sexo',
      'Nacionalidad',
      'Club',
      'Funcion',
      'Domicilio',
      'CP',
      'Localidad',
      'Provincia',
      'Telefono',
      'Tipo Lic. O Seg'
    ];

    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell, col) => {
      cell.font = { name: 'Arial', size: 11, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (col <= 6) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
      }
    });
    ws.getCell('F3').font = {
      name: 'Arial',
      size: 11,
      bold: true,
      color: { argb: 'FF0000' }
    };

    lista.forEach(p => {
      const row = ws.addRow([
        '',
        '',
        '',
        '',
        '',
        '',
        p.dni,
        p.cuil || '',
        p.apellido,
        `${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
        new Date(p.fechaNacimiento).toLocaleDateString(),
        p.sexo === 'M' ? 1 : 2,
        DEFAULTS.nacionalidad,
        p.club || DEFAULTS.club,
        DEFAULTS.funcion,
        p.direccion || '',
        DEFAULTS.codigoPostal,
        DEFAULTS.localidad,
        DEFAULTS.provincia,
        p.telefono || '',
        p.tipoLicSeg
      ]);
      row.eachCell({ includeEmpty: true }, cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitudes_seguros.xlsx';
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
