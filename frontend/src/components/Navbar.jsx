import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useAuth from '../store/useAuth';
import { getNotificaciones } from '../api/notificaciones';
import useNotifications from '../store/useNotifications';
import { getMe, updateProfilePicture } from '../api/usuarios';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { unread, setUnread } = useNotifications();
  const fileRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getMe(token);
        setProfile(me);
        const notifs = await getNotificaciones(token);
        setUnread(notifs.filter(n => !n.leida).length);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchData();
  }, [token, setUnread]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await updateProfilePicture(file, token);
      setProfile(p => ({ ...p, picture: res.picture }));
    } catch (err) {
      console.error(err);
      alert('Error al actualizar foto');
    }
  };

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
            {(isDelegado || isTecnico) ? (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  id="newsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Noticias
                </a>
                <ul className="dropdown-menu" aria-labelledby="newsDropdown">
                  <li>
                    <Link className="dropdown-item" to="/noticias">Ver Noticias</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/crear-noticia">Crear Noticia</Link>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/noticias">Noticias</Link>
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
            <li className="nav-item">
              <Link className="nav-link" to="/solicitud-seguro">Solicitud Seguro</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn position-relative me-3 p-0 bg-transparent border-0"
              onClick={() => navigate('/notificaciones')}
            >
              <i
                className={`bi bi-bell${unread > 0 ? '-fill' : ''}`}
                style={{
                  fontSize: '1.4rem',
                  color: unread > 0 ? 'red' : 'gray',
                  border: '1px solid #fff',
                  borderRadius: '50%',
                  padding: '4px'
                }}
              />
              {unread > 0 && (
                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">
                  {unread}
                </span>
              )}
            </button>

            <div className="dropdown me-3">
              <button
                className="btn p-0 border-0 bg-transparent dropdown-toggle"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                {profile?.picture ? (
                  <img
                    src={`http://localhost:5000/uploads/${profile.picture}`}
                    alt="Perfil"
                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                ) : (
                  <div
                    className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                  >
                    {(profile?.nombre || user.nombre || 'U')[0]}
                  </div>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <label htmlFor="profileInput" className="dropdown-item mb-0" style={{ cursor: 'pointer' }}>
                    Cambiar foto
                  </label>
                  <input
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    className="d-none"
                    ref={fileRef}
                    onChange={handlePictureChange}
                  />
                </li>
              </ul>
            </div>

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
