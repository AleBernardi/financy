import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Login } from './pages/Auth/Login'
import { SignUp } from './pages/Auth/SignUp'
import { PublicRoutes } from './routes/PublicRoutes'
import { Categories } from '@/pages/Categories/Index'
import { ProtectedRoutes } from './routes/ProtectedRoutes'
import { Profile } from './pages/Profile'
import { Transactions } from './pages/Transactions/Index'
import { Dashboard } from './pages/Dashboard'
import { useAuthStore } from '@/stores/auth'
import { PasswordRecover } from './pages/Auth/PasswordRecover'

function App() {
  const hasHydrated = useAuthStore.persist.hasHydrated()

  if (!hasHydrated) return null

  return (
    <Layout>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password-recover" element={<PasswordRecover />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
