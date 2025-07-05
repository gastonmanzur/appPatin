import React from 'react';

const Footer = () => (
  <footer className="bg-dark text-white py-3 mt-auto">
    <div className="container text-center">
      &copy; {new Date().getFullYear()} Federación de Patinaje
    </div>
  </footer>
);

export default Footer;
