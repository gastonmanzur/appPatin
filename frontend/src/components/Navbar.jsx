import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menu = () => {
    switch (user.role) {
      case 'Delegado':
  return <>
    <Link to="/dashboard">Dashboard</Link> |
    <Link to="/crear-noticia">Crear Noticia</Link> |
    <Link to="/crear-patinador">Crear Patinador</Link> |
    <Link to="/patinadores">Patinadores</Link> |
    <Link to="/crear-competencia">Crear Competencia</Link> |
    <Link to="/competencias">Competencias</Link> |
    <Link to="/mis-patinadores">Mis Patinadores</Link>
    <Link to="/titulos">Ver Títulos</Link> |
    <Link to="/titulos/individual">Nuevo Título Individual</Link> |
    <Link to="/titulos/club">Nuevo Título Club</Link>
  </>;
      case 'Tecnico':
        return <>
          <Link to="/dashboard">Dashboard</Link> |
          <Link to="/crear-noticia">Crear Noticia</Link>
            <Link to="/mis-patinadores">Mis Patinadores</Link>
        </>;
      default:
        return <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/mis-patinadores">Mis Patinadores</Link>
        </>;
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: '#eee' }}>
      <div>
        <Link to="/dashboard"><img src="/logo.png" alt="logo" height="40" /></Link>
        <Link to="/ranking">Ranking</Link>
        <Link to="/ranking-categorias">Ranking por Categorías</Link>
      </div>

      <div>{menu()}</div>

      <div>
        <span style={{ marginRight: 10 }}>{user.nombre}</span>
        <button onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
