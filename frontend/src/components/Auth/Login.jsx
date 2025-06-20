import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';



const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response.data.msg);
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
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const { credential } = credentialResponse;
              const decoded = jwtDecode(credential);
              const userData = {
                nombre: decoded.given_name,
                apellido: decoded.family_name,
                email: decoded.email,
                googleId: decoded.sub,
                picture: decoded.picture,
              };
              const res = await api.post('/auth/google-login', userData);
              localStorage.setItem('token', res.data.token);
              navigate('/dashboard');
            }}
            onError={() => alert('Google Login fallido')}
          />
          <div className="text-center mt-3">
            <button type="button" className="btn btn-link" onClick={() => navigate('/register')}>Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
