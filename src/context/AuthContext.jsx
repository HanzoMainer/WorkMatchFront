import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const signin = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    logout();
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signin, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}