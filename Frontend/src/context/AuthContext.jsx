import { createContext, useContext, useEffect, useRef, useState } from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracks whether a login/register has already resolved, so a
  // slower, earlier /auth/me check can't overwrite it afterward.
  const authenticatedRef = useRef(false);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      if (!authenticatedRef.current) {
        setUser(res.data.data);
      }
    } catch {
      if (!authenticatedRef.current) {
        setUser(null);
        setAccessToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    authenticatedRef.current = true;
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    authenticatedRef.current = true;
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    authenticatedRef.current = false;
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, refresh: fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);