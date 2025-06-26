import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { obtenerListaBuenaFe, listarCompetencias, descargarListaBuenaFeExcel } from '../api/competencias';
import { useParams } from 'react-router-dom';

const ListaBuenaFe = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [lista, setLista] = useState([]);
  const [competencia, setCompetencia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, comps] = await Promise.all([
          obtenerListaBuenaFe(id, token),
          listarCompetencias(token)
        ]);
        const withSeguro = data.map(p => ({ ...p, tipoSeguro: 'SA' }));
        setLista(withSeguro);
        const comp = comps.find(c => c._id === id);
        setCompetencia(comp);
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

  return (
    <div className="container mt-4">
      <h2>Lista de Buena Fe</h2>
      {lista.length === 0 ? (
        <p>No hay patinadores confirmados aún.</p>
      ) : (
        <>
        <button className="btn btn-success mb-3" onClick={exportarExcel}>
          Exportar a Excel
        </button>
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
            </tr>
          </thead>
          <tbody>
            {lista.map((p, idx) => (
              <tr key={p._id}>
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
