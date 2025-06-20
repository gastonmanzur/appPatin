import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CrearNoticia from './pages/CrearNoticia';
import MisPatinadores from './pages/MisPatinadores';
import CrearPatinador from './pages/CrearPatinador';
import Patinadores from './pages/Patinadores';
import EditarPatinador from './pages/EditarPatinador';
import VerPatinador from './pages/VerPatinador';
import CrearCompetencia from './pages/CrearCompetencia';
import Competencias from './pages/Competencias';
import ResultadosCompetencia from './pages/ResultadosCompetencia';
import ResultadosDetalle from './pages/ResultadosDetalle';
import RankingGeneral from './pages/RankingGeneral';
import RankingPorCategorias from './pages/RankingPorCategorias';
import ResultadosClubCompetencia from './pages/ResultadosClubCompetencia';
import CrearTituloIndividual from './pages/CrearTituloIndividual';
import CrearTituloClub from './pages/CrearTituloClub';
import Titulos from './pages/Titulos';
import NoticiaDetalle from './pages/NoticiaDetalle';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:token" element={<Verify />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
       <Route path="dashboard" element={<Dashboard />} />
       <Route path="crear-noticia" element={<CrearNoticia />} />
       <Route path="noticia/:id" element={<NoticiaDetalle />} />
        <Route path="mis-patinadores" element={<MisPatinadores />} />
          <Route path="crear-patinador" element={<CrearPatinador />} />
           <Route path="patinadores" element={<Patinadores />} />
           <Route path="editar-patinador/:id" element={<EditarPatinador />} />
           <Route path="patinador/:id" element={<VerPatinador />} />
           <Route path="crear-competencia" element={<CrearCompetencia />} />
          <Route path="competencias" element={<Competencias />} />
          <Route path="competencias/:id/resultados" element={<ResultadosCompetencia />} />
          <Route path="competencias/:id/detalle" element={<ResultadosDetalle />} />
          <Route path="ranking" element={<RankingGeneral />} />
           <Route path="ranking-categorias" element={<RankingPorCategorias />} />
           <Route path="competencias/:id/resultados-club" element={<ResultadosClubCompetencia />} />
            <Route path="titulos" element={<Titulos />} />
  <Route path="titulos/individual" element={<CrearTituloIndividual />} />
  <Route path="titulos/club" element={<CrearTituloClub />} />
      </Route>
    </Routes>
  );
};

export default App;
