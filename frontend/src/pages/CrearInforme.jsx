import React, { useEffect, useState } from 'react';
import useAuth from '../store/useAuth';
import { getTodosLosPatinadores } from '../api/gestionPatinadores';
import { crearInforme } from '../api/informes';

const CrearInforme = () => {
  const { token } = useAuth();
  const [patinadores, setPatinadores] = useState([]);
  const [form, setForm] = useState({ patinador: '', contenido: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTodosLosPatinadores(token);
        setPatinadores(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearInforme(form, token);
      alert('Informe creado');
      setForm({ patinador: '', contenido: '' });
    } catch (err) {
      console.error(err);
      alert('Error al crear informe');
    }
  };

  return (
    <div className="container my-4">
      <h2>Crear Informe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <select
            name="patinador"
            className="form-select"
            value={form.patinador}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un patinador</option>
            {patinadores.map(p => (
              <option key={p._id} value={p._id}>
                {p.primerNombre} {p.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <textarea
            name="contenido"
            className="form-control"
            value={form.contenido}
            onChange={handleChange}
            placeholder="Descripción del progreso"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CrearInforme;
