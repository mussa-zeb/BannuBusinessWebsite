import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import api from "../api/api";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/users/me");
        if (cancelled) return;
        if (!res.data?.success) return setStatus("denied");
        const user = res.data.user;
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          return setStatus("denied");
        }
        localStorage.setItem("user", JSON.stringify(user));
        setStatus("allowed");
      } catch {
        if (!cancelled) setStatus("denied");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowedRoles, location.pathname]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
        <LoaderCircle size={24} className="animate-spin text-[#111111]" />
        <span>Checking authentication...</span>
      </div>
    );
  }
  if (status === "denied") return <Navigate to="/login" replace />;
  return children;
}