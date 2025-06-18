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

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await api.post('/auth/google-login', { tokenId: credential });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Iniciar sesión</button>
      </form>

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

    // Ahora llamás a tu backend:
    const res = await api.post('/auth/google-login', userData);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  }}
  onError={() => alert("Google Login fallido")}
/>

    </>
  );
};

export default Login;
