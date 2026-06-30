import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  adminLogin as adminLoginRequest,
  login as loginRequest,
  logout as logoutRequest
} from '../services/authService.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = localStorage.getItem('tubaron.customer');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('tubaron.customer');
    localStorage.removeItem('tubaron.token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(readStoredUser);

  async function login(identifier, password) {
    const result = await loginRequest(identifier, password);
    const user = { ...result.customer, role: 'customer' };
    localStorage.setItem('tubaron.token', result.token);
    localStorage.setItem('tubaron.customer', JSON.stringify(user));
    setCustomer(user);
  }

  async function adminLogin(email, password) {
    const result = await adminLoginRequest(email, password);
    const user = { ...result.admin, role: result.admin.role || 'admin' };
    localStorage.setItem('tubaron.token', result.token);
    localStorage.setItem('tubaron.customer', JSON.stringify(user));
    setCustomer(user);
  }

  function clearSession() {
    localStorage.removeItem('tubaron.token');
    localStorage.removeItem('tubaron.customer');
    setCustomer(null);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }

  useEffect(() => {
    window.addEventListener('tubaron:logout', clearSession);
    return () => window.removeEventListener('tubaron:logout', clearSession);
  }, []);

  const value = useMemo(
    () => ({ customer, login, adminLogin, logout, signedIn: Boolean(customer), isAdmin: customer?.role === 'admin' }),
    [customer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
