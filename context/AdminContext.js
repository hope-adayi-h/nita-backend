"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  };

  const isAuthenticated = !!token;

  return (
    <AdminContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin doit être utilisé au sein de AdminProvider");
  }
  return context;
}
