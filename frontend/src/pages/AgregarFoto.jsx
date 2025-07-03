import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { subirFoto } from '../api/fotos';
import { useNavigate } from 'react-router-dom';

const AgregarFoto = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      await subirFoto(file, token);
      alert('Foto subida');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error al subir foto');
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Agregar Foto</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Subir
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarFoto;
