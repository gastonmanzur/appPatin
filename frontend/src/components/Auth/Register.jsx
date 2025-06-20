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
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4" style={{ minWidth: '320px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" name="apellido" placeholder="Apellido" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" name="password" type="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" name="confirmPassword" type="password" placeholder="Confirmar Password" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <select className="form-select" name="role" onChange={handleChange}>
              <option value="Deportista">Deportista</option>
              <option value="Tecnico">Técnico</option>
              <option value="Delegado">Delegado</option>
            </select>
          </div>
          {(form.role === 'Tecnico' || form.role === 'Delegado') && (
            <div className="mb-3">
              <input className="form-control" name="code" placeholder="Código Especial" onChange={handleChange} required />
            </div>
          )}
          <button className="btn btn-primary w-100 mb-3" type="submit">Registrar</button>
          <div className="text-center">
            <button type="button" className="btn btn-link" onClick={() => navigate('/')}>Ya tengo cuenta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
