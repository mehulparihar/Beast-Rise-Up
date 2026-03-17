import React, { createContext, useContext, useEffect, useState } from "react";

// AuthContext: store user info {id, name, isAdmin, ...} or null
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this with real init (API call / token check)
  useEffect(() => {
    const raw = localStorage.getItem("app_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userObj) => {
    // call API, get token, save etc. Here we just set user directly
    localStorage.setItem("app_user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("app_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
