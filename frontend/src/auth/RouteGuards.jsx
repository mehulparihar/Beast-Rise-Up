// RouteGuards.jsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import Loading from "../pages/Loading"; // adjust path if needed

// simple hook to read minimal auth fields
const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const refresh = useAuthStore((s) => s.refresh);
  return { user, token, loading, refresh };
};

// Ensures user is authenticated. Tries refresh if no token.
export function RequireAuth({ children }) {
  const { user, token, loading, refresh } = useAuth();
  const loc = useLocation();

  useEffect(() => {
    // if no token, try refresh once (non-blocking)
    if (!token && !loading) {
      refresh().catch(() => {});
    }
  }, [token, loading, refresh]);

  if (loading) return <Loading />; // show spinner while fetching/refreshing
  if (!token && !user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

// Ensures user is authenticated and admin
export function RequireAdmin({ children }) {
  const { user, token, loading, refresh } = useAuth();
  const loc = useLocation();

  useEffect(() => {
    if (!token && !loading) {
      refresh().catch(() => {});
    }
  }, [token, loading, refresh]);

  if (loading) return <Loading />;
  if (!token && !user) return <Navigate to="/login" state={{ from: loc }} replace />;
  // protect by role field (adjust if your user role key differs)
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
