import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearNoticia } from '../api/news';
import { useNavigate } from 'react-router-dom';

const CrearNoticia = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ titulo: '', contenido: '', imagen: null });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, imagen: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearNoticia(form, token);
      alert("Noticia creada correctamente");
      navigate('/noticias');
    } catch (err) {
      console.error(err);
      alert("Error al crear noticia");
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Crear Noticia</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="titulo"
                    placeholder="Título"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    name="contenido"
                    placeholder="Contenido"
                    rows="5"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="file"
                    name="imagen"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Publicar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearNoticia;
