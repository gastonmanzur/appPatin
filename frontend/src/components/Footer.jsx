import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dark text-white mt-auto py-4">
    <div className="container">
      <div className="row text-center text-md-start">
        <div className="col-md-3 mb-3 mb-md-0 border-end">
          <h5>Reseña</h5>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
            mi sit amet dolor tempor efficitur. Sed non pharetra nulla. Aliquam
            erat volutpat. Curabitur at efficitur nisl, nec lacinia ligula.
            Integer venenatis sapien at lorem laoreet, vel fringilla. Mauris
            dictum metus ut libero finibus, quis tempor justo fermentum. Nam
            consequat.
          </p>
        </div>
        <div className="col-md-3 mb-3 mb-md-0 border-end">
          <h5>Nosotros</h5>
          <ul className="list-unstyled">
            <li>
              <Link to="/nosotros" className="text-white">
                Acceso a Nosotros
              </Link>
            </li>
            <li>
              <Link to="/noticias" className="text-white">
                Ver Noticias
              </Link>
            </li>
            <li>
              <Link to="/titulos" className="text-white">
                Ver Títulos
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3 mb-3 mb-md-0 border-end">
          <h5>Secciones</h5>
          <ul className="list-unstyled">
            <li>
              <Link to="/mis-patinadores" className="text-white">
                Mis patinadores
              </Link>
            </li>
            <li>
              <Link to="/informes" className="text-white">
                Informes
              </Link>
            </li>
            <li>
              <Link to="/ranking" className="text-white">
                Ranking por clubes
              </Link>
            </li>
            <li>
              <Link to="/ranking-categorias" className="text-white">
                Ranking por categorías
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <h5>Contacto</h5>
          <p className="mb-1">Dirección del club</p>
          <p className="mb-1">Teléfono: 123-456789</p>
          <div>
            <a href="#" className="text-white me-2">
              <i className="bi bi-facebook" />
            </a>
            <a href="#" className="text-white me-2">
              <i className="bi bi-instagram" />
            </a>
            <a href="#" className="text-white">
              <i className="bi bi-twitter" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        &copy; {new Date().getFullYear()} Federación de Patinaje
      </div>
    </div>
  </footer>
);

export default Footer;
