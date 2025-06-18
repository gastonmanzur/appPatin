import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearCompetencia } from '../api/competencias';
import { useNavigate } from 'react-router-dom';

const CrearCompetencia = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    fecha: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await crearCompetencia(form, token);
      alert("Competencia creada");
      navigate('/competencias');
    } catch (err) {
      console.error(err);
      alert("Error al crear competencia");
    }
  };

  return (
    <div>
      <h2>Crear Competencia</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input type="date" name="fecha" onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default CrearCompetencia;
