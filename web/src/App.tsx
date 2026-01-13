import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Login } from './pages/Auth/Login'
import { SignUp } from './pages/Auth/SignUp'
import { PublicRoutes } from './routes/PublicRoutes'
import { Categories } from '@/pages/Categories/Index'
import { ProtectedRoutes } from './routes/ProtectedRoutes'

function App() {

  return (
    <Layout>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path='/categories' element={<Categories />} />
        </Route>
      </Routes>
    </Layout>
  )
}

export default App
