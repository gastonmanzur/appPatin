import React, { useState } from 'react';
import useAuth from '../store/useAuth';
import { crearSolicitudSeguro } from '../api/seguros';
import { useNavigate } from 'react-router-dom';

const SolicitudSeguro = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dni: '',
    cuil: '',
    apellido: '',
    nombres: '',
    fechaNacimiento: '',
    sexo: '1',
    nacionalidad: 'Argentina',
    club: 'General Rodriguez',
    funcion: 'patinador',
    codigoPostal: '1748',
    localidad: 'General Rodriguez',
    provincia: 'Bs. As.',
    telefono: '',
    tipoLicSeg: 'SA'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await crearSolicitudSeguro(form, token);
      alert('Solicitud enviada correctamente');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error al enviar solicitud');
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Solicitud de Seguro</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="dni"
                    placeholder="DNI"
                    value={form.dni}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="cuil"
                    placeholder="CUIL"
                    value={form.cuil}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="apellido"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="nombres"
                    placeholder="Nombre y Segundo Nombre"
                    value={form.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="date"
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChange}
                  >
                    <option value="1">Varón</option>
                    <option value="2">Mujer</option>
                  </select>
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="nacionalidad"
                    placeholder="Nacionalidad"
                    value={form.nacionalidad}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="club"
                    placeholder="Club"
                    value={form.club}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="funcion"
                    placeholder="Función"
                    value={form.funcion}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="codigoPostal"
                    placeholder="Código Postal"
                    value={form.codigoPostal}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="localidad"
                    placeholder="Localidad"
                    value={form.localidad}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="provincia"
                    placeholder="Provincia"
                    value={form.provincia}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="telefono"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <select
                    className="form-select"
                    name="tipoLicSeg"
                    value={form.tipoLicSeg}
                    onChange={handleChange}
                  >
                    <option value="SA">SA</option>
                    <option value="SD">SD</option>
                    <option value="LN">LN</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudSeguro;
