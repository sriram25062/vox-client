import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ import decoder

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to decode and store user info from token
  const decodeAndSetUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid token:", error);
      logout(); // clear everything if invalid
    }
  };

  // ✅ Login function
  const login = (token) => {
    localStorage.setItem("token", token);
    decodeAndSetUser(token);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  // ✅ Check token on first load (so login persists after refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) decodeAndSetUser(token);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
