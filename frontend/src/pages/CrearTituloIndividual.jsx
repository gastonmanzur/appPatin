import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { crearTituloIndividual } from '../api/titulos';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useNavigate } from 'react-router-dom';

const CrearTituloIndividual = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patinador: '',
    titulo: '',
    posicion: '',
    fecha: '',
    torneo: ''
  });

  const [patinadores, setPatinadores] = useState([]);

  useEffect(() => {
    const fetchPatinadores = async () => {
      const data = await getTodosLosPatinadores(token);
      setPatinadores(data);
    };
    fetchPatinadores();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearTituloIndividual(form, token);
      alert("Título individual guardado");
      navigate('/titulos');
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div>
      <h2>Nuevo Título Individual</h2>
      <form onSubmit={handleSubmit}>
        <select name="patinador" onChange={handleChange} required>
          <option value="">Seleccionar Patinador</option>
          {patinadores.map(p => (
            <option key={p._id} value={p._id}>{p.primerNombre} {p.apellido}</option>
          ))}
        </select>
        <input name="titulo" placeholder="Título" onChange={handleChange} required />
        <input name="posicion" placeholder="Posición" type="number" onChange={handleChange} />
        <input name="torneo" placeholder="Torneo" onChange={handleChange} />
        <input name="fecha" type="date" onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default CrearTituloIndividual;
