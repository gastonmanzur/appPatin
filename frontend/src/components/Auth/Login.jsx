import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuth from '../../store/useAuth';



const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.msg || 'Error al iniciar sesión';
      alert(message);
    }
  };


  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4" style={{ minWidth: '320px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" name="password" type="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <button className="btn btn-primary w-100 mb-3" type="submit">Iniciar sesión</button>
          {googleClientId ? (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const { credential } = credentialResponse;
                const res = await api.post('/auth/google-login', { credential });
                login(res.data.token);
                navigate('/dashboard');
              }}
              onError={() => alert('Google Login fallido')}
            />
          ) : (
            <div className="alert alert-warning text-center" role="alert">
              Configura VITE_GOOGLE_CLIENT_ID para habilitar Google Login
            </div>
          )}
          <div className="text-center mt-3">
            <button type="button" className="btn btn-link" onClick={() => navigate('/register')}>Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
