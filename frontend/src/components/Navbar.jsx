import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menu = () => {
    switch (user.role) {
      case 'Delegado':
        return (
          <>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/crear-noticia">Crear Noticia</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/crear-patinador">Crear Patinador</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/patinadores">Patinadores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/crear-competencia">Crear Competencia</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/competencias">Competencias</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/mis-patinadores">Mis Patinadores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/titulos">Ver Títulos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/titulos/individual">Nuevo Título Individual</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/titulos/club">Nuevo Título Club</Link></li>
          </>
        );
      case 'Tecnico':
        return (
          <>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/crear-noticia">Crear Noticia</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/mis-patinadores">Mis Patinadores</Link></li>
          </>
        );
      default:
        return (
          <>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/mis-patinadores">Mis Patinadores</Link></li>
          </>
        );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <img src="/logo.png" alt="logo" height="40" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/ranking">Ranking</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/ranking-categorias">Ranking por Categorías</Link></li>
            {menu()}
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">{user.nombre}</span>
            <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
