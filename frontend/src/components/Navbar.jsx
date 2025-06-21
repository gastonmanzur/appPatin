import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isDelegado = user.role === 'Delegado';
  const isTecnico = user.role === 'Tecnico';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <img src="/logo.png" alt="logo" height="40" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            {(isDelegado || isTecnico) && (
              <li className="nav-item">
                <Link className="nav-link" to="/crear-noticia">Crear Noticia</Link>
              </li>
            )}
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="rankingDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ranking
              </a>
              <ul className="dropdown-menu" aria-labelledby="rankingDropdown">
                <li><Link className="dropdown-item" to="/ranking">Ranking</Link></li>
                <li><Link className="dropdown-item" to="/ranking-categorias">Ranking por Categorías</Link></li>
              </ul>
            </li>
            {isDelegado ? (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  id="patinadoresDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Patinadores
                </a>
                <ul className="dropdown-menu" aria-labelledby="patinadoresDropdown">
                  <li><Link className="dropdown-item" to="/patinadores">Patinadores</Link></li>
                  <li><Link className="dropdown-item" to="/crear-patinador">Crear Patinador</Link></li>
                  <li><Link className="dropdown-item" to="/mis-patinadores">Mis Patinadores</Link></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/mis-patinadores">Mis Patinadores</Link>
              </li>
            )}
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="competenciasDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Competencias
              </a>
              <ul className="dropdown-menu" aria-labelledby="competenciasDropdown">
                <li><Link className="dropdown-item" to="/competencias">Competencias</Link></li>
                <li><Link className="dropdown-item" to="/crear-competencia">Crear Competencia</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                id="titulosDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Títulos
              </a>
              <ul className="dropdown-menu" aria-labelledby="titulosDropdown">
                <li><Link className="dropdown-item" to="/titulos">Ver Títulos</Link></li>
                <li><Link className="dropdown-item" to="/titulos/individual">Nuevo Título Individual</Link></li>
                <li><Link className="dropdown-item" to="/titulos/club">Nuevo Título Club</Link></li>
              </ul>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">{user.nombre}</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
