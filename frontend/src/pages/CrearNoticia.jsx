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
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Error al crear noticia");
    }
  };

  return (
    <div>
      <h2>Crear Noticia</h2>
      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" onChange={handleChange} required />
        <textarea name="contenido" placeholder="Contenido" onChange={handleChange} required />
        <input type="file" name="imagen" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Publicar</button>
      </form>
    </div>
  );
};

export default CrearNoticia;
