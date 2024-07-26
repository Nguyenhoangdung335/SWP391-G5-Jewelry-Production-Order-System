import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const setToken = (newToken) => {
    setToken_(newToken);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }

    axios.defaults.validateStatus = (status) => {
      if (status === 401) {
        setToken(null);
        navigate("/login");
        return false;
      }
      return status >= 200;
    };

    // const interceptor = axios.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   (error) => {
    //     if (error.response && error.response.status === 401) {
    //       setToken(null);
    //       navigate("/login");
    //     }
    //     return Promise.reject(error);
    //   }
    // );
    // return () => {
    //   axios.interceptors.response.eject(interceptor);
    // };
    
  }, [token, navigate]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
