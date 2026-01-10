import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { PublicRoutes } from './routes/PublicRoutes'
import { ProtectedRoutes } from './routes/ProtectedRoutes'

function App() {

  return (
    <Layout>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        {/* <Route element={<ProtectedRoutes />>

        </Route> */}
      </Routes>
    </Layout>
  )
}

export default App
