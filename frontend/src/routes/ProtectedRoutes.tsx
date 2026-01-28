import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'

export function ProtectedRoutes() {
  const { isAuthenticated, token, logout } = useAuthStore()

  const isTokenExpired = (token: string | null) => {
    if (!token) return true
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      return decoded.exp < Date.now() / 1000
    } catch {
      return true
    }
  }

  if (isAuthenticated && isTokenExpired(token)) {
    logout()
    return <Navigate to="/login" replace />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
