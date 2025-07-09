import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearTorneo } from '../api/torneos';
import { useNavigate } from 'react-router-dom';

const CrearTorneo = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearTorneo(form, token);
      alert('Torneo creado');
      navigate('/torneos');
    } catch (err) {
      console.error(err);
      alert('Error al crear torneo');
    }
  };

  return (
    <div>
      <h2>Crear Torneo</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} className="form-control my-2" />
        <input type="date" name="fechaInicio" onChange={handleChange} />
        <input type="date" name="fechaFin" onChange={handleChange} className="ms-2" />
        <button type="submit" className="btn btn-primary ms-2">Crear</button>
      </form>
    </div>
  );
};

export default CrearTorneo;
