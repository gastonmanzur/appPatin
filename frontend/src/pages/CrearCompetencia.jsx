import React, { useState, useEffect } from 'react';
import useAuth from '../store/useAuth';
import { crearCompetencia } from '../api/competencias';
import { listarTorneos } from '../api/torneos';
import { useNavigate } from 'react-router-dom';

const CrearCompetencia = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    clubOrganizador: '',
    torneo: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const data = await listarTorneos(token);
        setTorneos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTorneos();
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await crearCompetencia(form, token);
      alert("Competencia creada");
      navigate('/competencias');
    } catch (err) {
      console.error(err);
      alert("Error al crear competencia");
    }
  };

  return (
    <div>
      <h2>Crear Competencia</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Titulo" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="Descripcion" onChange={handleChange} className="form-control my-2" />
        <input
          name="clubOrganizador"
          placeholder="Club organizador"
          onChange={handleChange}
          className="form-control my-2"
        />
        <select name="torneo" onChange={handleChange} className="form-select my-2">
          <option value="">Sin torneo</option>
          {torneos.map(t => (
            <option key={t._id} value={t._id}>{t.nombre}</option>
          ))}
        </select>
        <input type="date" name="fecha" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary mt-2">Crear</button>
      </form>
    </div>
  );
};

export default CrearCompetencia;
