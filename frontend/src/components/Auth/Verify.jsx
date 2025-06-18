import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify/${token}`);
        alert('Cuenta verificada correctamente.');
        navigate('/');
      } catch (err) {
        alert('Error al verificar cuenta.');
        navigate('/');
      }
    };
    verify();
  }, [token, navigate]);

  return <p>Verificando cuenta...</p>;
};

export default Verify;
