import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { jwtDecode } from "jwt-decode"

export function ProtectedRoutes() {
    const { isAuthenticated, token, logout } = useAuthStore()

    const isTokenExpired = (token: string | null) => {
        if (!token) return true;

        try {
            const decoded = jwtDecode<{ exp: number }>(token);
            const currentTime = Date.now() / 1000;

            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    if (isAuthenticated && isTokenExpired(token)) {
        console.warn("Sessão expirada. Redirecionando...");
        logout();
        return <Navigate to="/login" replace />;
    }

    return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />
}