import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 🔴 TEMP FAKE USER (until backend auth is ready)
  const [user, setUser] = useState({
    role: "student",
    name: "Demo User",
    email: "demo@student.com",
  });

  function login() {}
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
