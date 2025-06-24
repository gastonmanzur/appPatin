import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { obtenerListaBuenaFe } from '../api/competencias';
import { useParams } from 'react-router-dom';

const ListaBuenaFe = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerListaBuenaFe(id, token);
        const withSeguro = data.map(p => ({ ...p, tipoSeguro: 'SA' }));
        setLista(withSeguro);
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

  return (
    <div className="container mt-4">
      <h2>Lista de Buena Fe</h2>
      {lista.length === 0 ? (
        <p>No hay patinadores confirmados aún.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Seguro</th>
              <th>N° Patinador</th>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Segundo Nombre</th>
              <th>Categoría</th>
              <th>Club</th>
              <th>Fecha Nacimiento</th>
              <th>DNI</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p, idx) => (
              <tr key={p._id}>
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
                <td>{p.apellido}</td>
                <td>{p.primerNombre}</td>
                <td>{p.segundoNombre}</td>
                <td>{p.categoria}</td>
                <td>{p.club}</td>
                <td>{new Date(p.fechaNacimiento).toLocaleDateString()}</td>
                <td>{p.dni}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaBuenaFe;
