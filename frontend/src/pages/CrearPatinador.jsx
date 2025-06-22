import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearPatinador } from '../api/gestionPatinadores';
import { useNavigate } from 'react-router-dom';

const CrearPatinador = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    primerNombre: '',
    segundoNombre: '',
    apellido: '',
    edad: '',
    fechaNacimiento: '',
    dni: '',
    cuil: '',
    direccion: '',
    dniMadre: '',
    dniPadre: '',
    telefono: '',
    sexo: 'M',
    nivel: 'Federado',
    numeroCorredor: '',
    foto: null,
    fotoRostro: null
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const { name, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      }

      await crearPatinador(formData, token);
      alert("Patinador creado correctamente");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Error al crear patinador");
    }
  };

    return (
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Crear Patinador</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="primerNombre"
                      placeholder="Primer Nombre"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="segundoNombre"
                      placeholder="Segundo Nombre"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="apellido"
                      placeholder="Apellido"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="edad"
                      type="number"
                      placeholder="Edad"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="fechaNacimiento"
                      type="date"
                      placeholder="Fecha de Nacimiento"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="dni"
                      placeholder="DNI"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="cuil"
                      placeholder="CUIL"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="direccion"
                      placeholder="Dirección"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="dniMadre"
                      placeholder="DNI Madre"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="dniPadre"
                      placeholder="DNI Padre"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="telefono"
                      placeholder="Teléfono"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      name="sexo"
                      onChange={handleChange}
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      name="nivel"
                      onChange={handleChange}
                    >
                      <option value="Federado">Federado</option>
                      <option value="Intermedia">Intermedia</option>
                      <option value="Transicion">Transición</option>
                      <option value="Escuela">Escuela</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="numeroCorredor"
                      type="number"
                      placeholder="Número Corredor"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Foto Cuerpo:</label>
                    <input
                      className="form-control"
                      type="file"
                      name="foto"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Foto Rostro:</label>
                    <input
                      className="form-control"
                      type="file"
                      name="fotoRostro"
                      onChange={handleFileChange}
                      accept="image/*"
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

export default CrearPatinador;
