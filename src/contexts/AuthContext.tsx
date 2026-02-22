import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  organization: string;
  login: (username: string, organization: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [organization, setOrganization] = useState("");

  const login = (user: string, org: string) => {
    setUsername(user);
    setOrganization(org);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setOrganization("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, organization, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
