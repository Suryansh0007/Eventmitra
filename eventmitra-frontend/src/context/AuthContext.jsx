import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

function loadUser() {
  const raw = localStorage.getItem("em_user");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // user shape: { userId, email, role, fullName }
  const login = useCallback((authResponse, fullName) => {
    const nextUser = {
      userId: authResponse.userId,
      email: authResponse.email,
      role: authResponse.role,
      fullName: fullName || authResponse.email,
    };
    localStorage.setItem("em_token", authResponse.token);
    localStorage.setItem("em_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("em_token");
    localStorage.removeItem("em_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
