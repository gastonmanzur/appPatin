import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', confirmPassword: '', role: 'Deportista', code: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registrado. Verifica tu email.');
      navigate('/');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="confirmPassword" type="password" placeholder="Confirmar Password" onChange={handleChange} required />

      <select name="role" onChange={handleChange}>
        <option value="Deportista">Deportista</option>
        <option value="Tecnico">Técnico</option>
        <option value="Delegado">Delegado</option>
      </select>

      {(form.role === 'Tecnico' || form.role === 'Delegado') && (
        <input name="code" placeholder="Código Especial" onChange={handleChange} required />
      )}

      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
