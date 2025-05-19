import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("fullName");

    if (token) {
      setIsAuth(true);
      setFullName(storedName || "");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, fullName, setFullName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
