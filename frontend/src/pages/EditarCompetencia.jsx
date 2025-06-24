import React, { useState, useEffect } from 'react';
import useAuth from '../store/useAuth';
import { editarCompetencia, listarCompetencias } from '../api/competencias';
import { useNavigate, useParams } from 'react-router-dom';

const EditarCompetencia = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({ nombre: '', descripcion: '', fecha: '', clubOrganizador: '' });

  useEffect(() => {
    const cargar = async () => {
      const comps = await listarCompetencias(token);
      const comp = comps.find(c => c._id === id);
      if (comp) {
        setForm({
          nombre: comp.nombre,
          descripcion: comp.descripcion || '',
          fecha: comp.fecha.substring(0, 10),
          clubOrganizador: comp.clubOrganizador || ''
        });
      }
    };
    cargar();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await editarCompetencia(id, form, token);
      alert('Competencia actualizada');
      navigate('/competencias');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2>Editar Competencia</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control my-2" />
        <input
          name="clubOrganizador"
          value={form.clubOrganizador}
          onChange={handleChange}
          placeholder="Club organizador"
          className="form-control my-2"
        />
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarCompetencia;
