import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requireRole = null }) => {
  const user = useSelector((state) => state.user.user);

  if (requireRole && user?.role?.toLowerCase() !== requireRole?.toLowerCase()) {
    return <Navigate to="/access-denied" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
