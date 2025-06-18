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
    <div>
      <h2>Editar Patinador</h2>
      <form onSubmit={handleSubmit}>
        <input name="primerNombre" placeholder="Primer Nombre" onChange={handleChange} value={form.primerNombre} required />
        <input name="segundoNombre" placeholder="Segundo Nombre" onChange={handleChange} value={form.segundoNombre || ''} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} value={form.apellido} required />
        <input name="edad" type="number" placeholder="Edad" onChange={handleChange} value={form.edad} required />
        <input name="fechaNacimiento" type="date" placeholder="Fecha Nacimiento" onChange={handleChange} value={form.fechaNacimiento?.substr(0,10)} required />
        <input name="dni" placeholder="DNI" onChange={handleChange} value={form.dni} required />
        <input name="cuil" placeholder="CUIL" onChange={handleChange} value={form.cuil} />
        <input name="direccion" placeholder="Dirección" onChange={handleChange} value={form.direccion} />
        <input name="dniMadre" placeholder="DNI Madre" onChange={handleChange} value={form.dniMadre} />
        <input name="dniPadre" placeholder="DNI Padre" onChange={handleChange} value={form.dniPadre} />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} value={form.telefono} />
        
        <select name="sexo" onChange={handleChange} value={form.sexo}>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <select name="nivel" onChange={handleChange} value={form.nivel}>
          <option value="Federado">Federado</option>
          <option value="Intermedia">Intermedia</option>
          <option value="Transicion">Transición</option>
          <option value="Escuela">Escuela</option>
        </select>

        <input name="numeroCorredor" type="number" placeholder="Número Corredor" onChange={handleChange} value={form.numeroCorredor} />
        
        <label>Actualizar Foto (opcional):</label>
        <input type="file" name="foto" onChange={handleFileChange} accept="image/*" />

        <label>Actualizar Foto Rostro (opcional):</label>
        <input type="file" name="fotoRostro" onChange={handleFileChange} accept="image/*" />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarPatinador;
