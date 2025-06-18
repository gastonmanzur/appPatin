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
    <div>
      <h2>Crear Patinador</h2>
      <form onSubmit={handleSubmit}>
        <input name="primerNombre" placeholder="Primer Nombre" onChange={handleChange} required />
        <input name="segundoNombre" placeholder="Segundo Nombre" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
        <input name="edad" type="number" placeholder="Edad" onChange={handleChange} required />
        <input name="fechaNacimiento" type="date" placeholder="Fecha de Nacimiento" onChange={handleChange} required />
        <input name="dni" placeholder="DNI" onChange={handleChange} required />
        <input name="cuil" placeholder="CUIL" onChange={handleChange} />
        <input name="direccion" placeholder="Dirección" onChange={handleChange} />
        <input name="dniMadre" placeholder="DNI Madre" onChange={handleChange} />
        <input name="dniPadre" placeholder="DNI Padre" onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        
        <select name="sexo" onChange={handleChange}>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <select name="nivel" onChange={handleChange}>
          <option value="Federado">Federado</option>
          <option value="Intermedia">Intermedia</option>
          <option value="Transicion">Transición</option>
          <option value="Escuela">Escuela</option>
        </select>

        <input name="numeroCorredor" type="number" placeholder="Número Corredor" onChange={handleChange} />
        
        <label>Foto Cuerpo:</label>
        <input type="file" name="foto" onChange={handleFileChange} accept="image/*" />
        
        <label>Foto Rostro:</label>
        <input type="file" name="fotoRostro" onChange={handleFileChange} accept="image/*" />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default CrearPatinador;
