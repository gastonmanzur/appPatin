import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div
        className="container py-4 flex-grow-1 d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
