import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearTituloClub } from '../api/titulos';
import { useNavigate } from 'react-router-dom';

const CrearTituloClub = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: '',
    posicion: '',
    fecha: '',
    torneo: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearTituloClub(form, token);
      alert("Título de club guardado");
      navigate('/titulos');
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div>
      <h2>Nuevo Título de Club</h2>
      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" onChange={handleChange} required />
        <input name="posicion" placeholder="Posición" type="number" onChange={handleChange} />
        <input name="torneo" placeholder="Torneo" onChange={handleChange} />
        <input name="fecha" type="date" onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default CrearTituloClub;
