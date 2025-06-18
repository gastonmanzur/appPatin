import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useParams } from 'react-router-dom';

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
    <div>
      <h2>Ficha de {patinador.primerNombre} {patinador.apellido}</h2>

      {patinador.fotoRostro && (
        <img 
          src={`http://localhost:5000/uploads/${patinador.fotoRostro}`} 
          alt="Rostro" 
          style={{ width: '200px', borderRadius: '50%' }} 
        />
      )}

      <p><strong>Edad:</strong> {patinador.edad}</p>
      <p><strong>Fecha Nacimiento:</strong> {new Date(patinador.fechaNacimiento).toLocaleDateString()}</p>
      <p><strong>DNI:</strong> {patinador.dni}</p>
      <p><strong>CUIL:</strong> {patinador.cuil}</p>
      <p><strong>Dirección:</strong> {patinador.direccion}</p>
      <p><strong>Teléfono:</strong> {patinador.telefono}</p>
      <p><strong>Número Corredor:</strong> {patinador.numeroCorredor}</p>
      <p><strong>Sexo:</strong> {patinador.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
      <p><strong>Nivel:</strong> {patinador.nivel}</p>
      <p><strong>Categoría:</strong> {patinador.categoria}</p>

      {patinador.foto && (
        <div>
          <h3>Foto Completa:</h3>
          <img src={`http://localhost:5000/uploads/${patinador.foto}`} alt="Foto" style={{ maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default VerPatinador;
