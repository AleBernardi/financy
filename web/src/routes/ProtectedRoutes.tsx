import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"

export function ProtectedRoutes() {
    const { isAuthenticated } = useAuthStore()

    return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />
}