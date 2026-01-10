import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"

export function PublicRoutes() {
    const { isAuthenticated } = useAuthStore()

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}