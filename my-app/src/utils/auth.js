import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("spams_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem("spams_user", JSON.stringify(user));
    else sessionStorage.removeItem("spams_user");
  }, [user]);

  async function login(email, password) {
    const res = await api.login(email, password);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
