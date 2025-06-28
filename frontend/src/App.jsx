import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CrearNoticia from './pages/CrearNoticia';
import Noticias from './pages/Noticias';
import MisPatinadores from './pages/MisPatinadores';
import CrearPatinador from './pages/CrearPatinador';
import Patinadores from './pages/Patinadores';
import EditarPatinador from './pages/EditarPatinador';
import VerPatinador from './pages/VerPatinador';
import CrearCompetencia from './pages/CrearCompetencia';
import EditarCompetencia from './pages/EditarCompetencia';
import Competencias from './pages/Competencias';
import VerCompetencia from './pages/VerCompetencia';
import ResultadosCompetencia from './pages/ResultadosCompetencia';
import ResultadosDetalle from './pages/ResultadosDetalle';
import RankingGeneral from './pages/RankingGeneral';
import RankingPorCategorias from './pages/RankingPorCategorias';
import ResultadosClubCompetencia from './pages/ResultadosClubCompetencia';
import CrearTituloIndividual from './pages/CrearTituloIndividual';
import CrearTituloClub from './pages/CrearTituloClub';
import EditarTituloIndividual from './pages/EditarTituloIndividual';
import EditarTituloClub from './pages/EditarTituloClub';
import Titulos from './pages/Titulos';
import NoticiaDetalle from './pages/NoticiaDetalle';
import ConfirmarCompetencia from './pages/ConfirmarCompetencia';
import Notificaciones from './pages/Notificaciones';
import ListaBuenaFe from './pages/ListaBuenaFe';
import SolicitudSeguro from './pages/SolicitudSeguro';
import CrearInforme from './pages/CrearInforme';
import RegistrarAsistencia from './pages/RegistrarAsistencia';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<Verify />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
       <Route path="dashboard" element={<Dashboard />} />
       <Route path="noticias" element={<Noticias />} />
       <Route path="crear-noticia" element={<CrearNoticia />} />
       <Route path="noticia/:id" element={<NoticiaDetalle />} />
        <Route path="mis-patinadores" element={<MisPatinadores />} />
          <Route path="crear-patinador" element={<CrearPatinador />} />
           <Route path="patinadores" element={<Patinadores />} />
           <Route path="editar-patinador/:id" element={<EditarPatinador />} />
           <Route path="patinador/:id" element={<VerPatinador />} />
           <Route path="crear-competencia" element={<CrearCompetencia />} />
          <Route path="competencias" element={<Competencias />} />
          <Route path="competencias/editar/:id" element={<EditarCompetencia />} />
          <Route path="competencia/:id" element={<VerCompetencia />} />
          <Route path="competencias/:id/lista-buena-fe" element={<ListaBuenaFe />} />
          <Route path="competencias/:id/resultados" element={<ResultadosCompetencia />} />
          <Route path="competencias/:id/detalle" element={<ResultadosDetalle />} />
          <Route path="competencias/:id/confirmar" element={<ConfirmarCompetencia />} />
          <Route path="ranking" element={<RankingGeneral />} />
           <Route path="ranking-categorias" element={<RankingPorCategorias />} />
           <Route path="competencias/:id/resultados-club" element={<ResultadosClubCompetencia />} />
           <Route path="titulos" element={<Titulos />} />
  <Route path="titulos/individual" element={<CrearTituloIndividual />} />
  <Route path="titulos/club" element={<CrearTituloClub />} />
  <Route path="titulos/individual/editar/:id" element={<EditarTituloIndividual />} />
  <Route path="titulos/club/editar/:id" element={<EditarTituloClub />} />
  <Route path="solicitud-seguro" element={<SolicitudSeguro />} />
  <Route path="notificaciones" element={<Notificaciones />} />
  <Route path="crear-informe" element={<CrearInforme />} />
  <Route path="registrar-asistencia" element={<RegistrarAsistencia />} />
      </Route>
    </Routes>
  );
};

export default App;
