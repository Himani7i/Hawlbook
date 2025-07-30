// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authStatus, setAuthStatus] = useState('loading'); 

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await API.get('/v1/auth/me', { withCredentials: true });
        const user = res.data;
        if (allowedRoles.includes(user.role)) {
          setAuthStatus('authorized');
        } else {
          setAuthStatus('unauthorized');
        }
      } catch (err) {
        setAuthStatus('unauth');
      }
    };

    verifyUser();
  }, [allowedRoles]);

  if (authStatus === 'loading') return <div>Loading...</div>;
  if (authStatus === 'unauth' || authStatus === 'unauthorized') return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
