import React, { useState, useEffect } from 'react';
import useAuth from '../store/useAuth';
import { editarPatinadorConImagen, getTodosLosPatinadores } from '../api/gestionPatinadores';
import { useParams, useNavigate } from 'react-router-dom';

const EditarPatinador = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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
    club: '',
    sexo: 'M',
    nivel: 'Federado',
    numeroCorredor: '',
    foto: null,
    fotoRostro: null
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const patinadores = await getTodosLosPatinadores(token);
      const patinador = patinadores.find(p => p._id === id);
      setForm({ ...patinador, foto: null, fotoRostro: null });
    };
    cargarDatos();
  }, []);

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

      await editarPatinadorConImagen(id, formData, token);
      alert("Patinador actualizado");
      navigate('/patinadores');
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Editar Patinador</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="primerNombre"
                    placeholder="Primer Nombre"
                    onChange={handleChange}
                    value={form.primerNombre}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="segundoNombre"
                    placeholder="Segundo Nombre"
                    onChange={handleChange}
                    value={form.segundoNombre || ''}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="apellido"
                    placeholder="Apellido"
                    onChange={handleChange}
                    value={form.apellido}
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
                    value={form.edad}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="fechaNacimiento"
                    type="date"
                    placeholder="Fecha Nacimiento"
                    onChange={handleChange}
                    value={form.fechaNacimiento?.substr(0, 10)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="dni"
                    placeholder="DNI"
                    onChange={handleChange}
                    value={form.dni}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="cuil"
                    placeholder="CUIL"
                    onChange={handleChange}
                    value={form.cuil}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="direccion"
                    placeholder="Dirección"
                    onChange={handleChange}
                    value={form.direccion}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="dniMadre"
                    placeholder="DNI Madre"
                    onChange={handleChange}
                    value={form.dniMadre}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    name="dniPadre"
                    placeholder="DNI Padre"
                    onChange={handleChange}
                    value={form.dniPadre}
                  />
                </div>
                <div className="mb-3">
                <input
                  className="form-control"
                  name="telefono"
                  placeholder="Teléfono"
                  onChange={handleChange}
                  value={form.telefono}
                />
               </div>
               <div className="mb-3">
                 <input
                   className="form-control"
                   name="club"
                   placeholder="Club"
                   onChange={handleChange}
                   value={form.club}
                 />
               </div>
               <div className="mb-3">
                  <select
                    className="form-select"
                    name="sexo"
                    onChange={handleChange}
                    value={form.sexo}
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
                    value={form.nivel}
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
                    value={form.numeroCorredor}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Actualizar Foto (opcional):</label>
                  <input
                    className="form-control"
                    type="file"
                    name="foto"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Actualizar Foto Rostro (opcional):</label>
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

export default EditarPatinador;
