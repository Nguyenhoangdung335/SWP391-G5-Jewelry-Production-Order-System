import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, roles, ...rest }) => {
  const { token } = useAuth();
  let decodedToken;

  if (token) {
    decodedToken = jwtDecode(token);
  }

  //Navigate to login page if user have not logged in or token has expired
  if (!token) {
    return <Navigate to="/login" />;
  }

  //Navigate to Home Page if the logged in user don't have enough permission
  if (roles && !roles.includes(decodedToken.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
