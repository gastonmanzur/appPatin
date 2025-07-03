import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearNotificacion } from '../api/notificaciones';
import { useNavigate } from 'react-router-dom';

const CrearNotificacion = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearNotificacion(mensaje, token);
      alert('Notificación creada');
      navigate('/notificaciones');
    } catch (err) {
      console.error(err);
      alert('Error al crear notificación');
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Crear Notificación</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Mensaje"
                    rows="4"
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearNotificacion;
