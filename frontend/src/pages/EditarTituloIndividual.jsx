import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { listarTitulosIndividuales, editarTituloIndividual } from '../api/titulos';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useNavigate, useParams } from 'react-router-dom';

const EditarTituloIndividual = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    patinador: '',
    titulo: '',
    posicion: '',
    fecha: '',
    torneo: '',
    imagen: null
  });
  const [patinadores, setPatinadores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const pats = await getTodosLosPatinadores(token);
      setPatinadores(pats);
      const titulos = await listarTitulosIndividuales(token);
      const t = titulos.find(x => x._id === id);
      if (t) {
        setForm({
          patinador: t.patinador?._id || '',
          titulo: t.titulo,
          posicion: t.posicion || '',
          fecha: t.fecha ? t.fecha.substring(0,10) : '',
          torneo: t.torneo || '',
          imagen: null
        });
      }
    };
    fetchData();
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
      await editarTituloIndividual(id, formData, token);
      alert('Título individual actualizado');
      navigate('/titulos');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar');
    }
  };

  return (
    <div>
      <h2>Editar Título Individual</h2>
      <form onSubmit={handleSubmit}>
        <select name="patinador" onChange={handleChange} value={form.patinador} required>
          <option value="">Seleccionar Patinador</option>
          {patinadores.map(p => (
            <option key={p._id} value={p._id}>{p.primerNombre} {p.apellido}</option>
          ))}
        </select>
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

export default EditarTituloIndividual;
