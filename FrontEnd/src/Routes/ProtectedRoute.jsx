import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [], children }) {
    const token = localStorage.getItem("token");

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        localStorage.removeItem("user");
    }

    // Check authentication.
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role authorization.
    if (!allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (user.role === "support_agent") {
            return <Navigate to="/agent/dashboard" replace />;
        }

        if (user.role === "customer") {
            return <Navigate to="/customer/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    // Support both wrapped children and nested route layouts.
    return children || <Outlet />;
}
