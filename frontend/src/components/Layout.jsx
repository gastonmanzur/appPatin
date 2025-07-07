import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div
        className={`container py-4 flex-grow-1${
          isDashboard ? '' : ' d-flex justify-content-center align-items-center'
        }`}
        style={{ minHeight: '80vh' }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
