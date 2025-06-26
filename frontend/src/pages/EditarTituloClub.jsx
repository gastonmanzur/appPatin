import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTitulosClub, editarTituloClub } from '../api/titulos';
import { useNavigate, useParams } from 'react-router-dom';

const EditarTituloClub = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    titulo: '',
    posicion: '',
    fecha: '',
    torneo: '',
    imagen: null
  });

  useEffect(() => {
    const cargar = async () => {
      const titulos = await listarTitulosClub(token);
      const t = titulos.find(x => x._id === id);
      if (t) {
        setForm({
          titulo: t.titulo,
          posicion: t.posicion || '',
          fecha: t.fecha ? t.fecha.substring(0,10) : '',
          torneo: t.torneo || '',
          imagen: null
        });
      }
    };
    cargar();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v) formData.append(k,v); });
      await editarTituloClub(id, formData, token);
      alert('Título de club actualizado');
      navigate('/titulos');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2>Editar Título de Club</h2>
      <form onSubmit={handleSubmit}>
        <input name="titulo" value={form.titulo} placeholder="Título" onChange={handleChange} required />
        <input name="posicion" value={form.posicion} placeholder="Posición" type="number" onChange={handleChange} />
        <input name="torneo" value={form.torneo} placeholder="Torneo" onChange={handleChange} />
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
        <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarTituloClub;
