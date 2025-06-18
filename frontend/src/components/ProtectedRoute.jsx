import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
