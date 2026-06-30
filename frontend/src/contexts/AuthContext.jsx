import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem('tubaron.customer');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(identifier, password) {
    const result = await loginRequest(identifier, password);
    localStorage.setItem('tubaron.token', result.token);
    localStorage.setItem('tubaron.customer', JSON.stringify(result.customer));
    setCustomer(result.customer);
  }

  function logout() {
    localStorage.removeItem('tubaron.token');
    localStorage.removeItem('tubaron.customer');
    setCustomer(null);
  }

  const value = useMemo(() => ({ customer, login, logout, signedIn: Boolean(customer) }), [customer]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
