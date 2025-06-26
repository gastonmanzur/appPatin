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
    torneo: '',
    imagen: null
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

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await crearTituloIndividual(formData, token);
      alert("Título individual guardado");
      navigate('/titulos');
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Nuevo Título Individual</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="patinador"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar Patinador</option>
                    {patinadores.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.primerNombre} {p.apellido}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <input
                    className="form-control"
                    name="posicion"
                    placeholder="Posición"
                    type="number"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="torneo"
                    placeholder="Torneo"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="fecha"
                    type="date"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    className="form-control"
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearTituloIndividual;
