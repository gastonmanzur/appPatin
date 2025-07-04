import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useParams } from 'react-router-dom';
import formatDate from '../utils/formatDate';

const VerPatinador = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [patinador, setPatinador] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodosLosPatinadores(token);
      const p = data.find(p => p._id === id);
      setPatinador(p);
    };

    fetchData();
  }, []);

  if (!patinador) return <p>Cargando...</p>;

  return (
    <div className="container my-4">
      <div className="card mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body text-center">
          <h2 className="card-title mb-3">Ficha de {patinador.primerNombre} {patinador.apellido}</h2>

          {patinador.fotoRostro && (
            <img
              src={`http://localhost:5000/uploads/${patinador.fotoRostro}`}
              alt="Rostro"
              className="rounded-circle mb-3"
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          )}

          <p className="mb-1"><strong>Edad:</strong> {patinador.edad}</p>
          <p className="mb-1"><strong>Fecha Nacimiento:</strong> {formatDate(patinador.fechaNacimiento)}</p>
          <p className="mb-1"><strong>DNI:</strong> {patinador.dni}</p>
          <p className="mb-1"><strong>CUIL:</strong> {patinador.cuil}</p>
          <p className="mb-1"><strong>Dirección:</strong> {patinador.direccion}</p>
          <p className="mb-1"><strong>Teléfono:</strong> {patinador.telefono}</p>
          <p className="mb-1"><strong>Número Corredor:</strong> {patinador.numeroCorredor}</p>
          <p className="mb-1"><strong>Sexo:</strong> {patinador.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
          <p className="mb-1"><strong>Nivel:</strong> {patinador.nivel}</p>
          <p className="mb-3"><strong>Categoría:</strong> {patinador.categoria}</p>

          {patinador.foto && (
            <div className="mt-4">
              <h3>Foto Completa:</h3>
              <img
                src={`http://localhost:5000/uploads/${patinador.foto}`}
                alt="Foto"
                className="img-fluid"
                style={{ maxWidth: '400px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerPatinador;
