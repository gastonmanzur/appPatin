import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { confirmarCompetencia } from '../api/competencias';

const ConfirmarCompetencia = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const enviar = async () => {
      const respuesta = search.get('respuesta');
      if (!respuesta) return;
      try {
        await confirmarCompetencia(id, respuesta, token);
        alert('Respuesta registrada');
      } catch (err) {
        console.error(err);
        alert('Error al confirmar');
      }
      navigate('/competencias');
    };
    enviar();
  }, []);

  return <p>Procesando...</p>;
};

export default ConfirmarCompetencia;
