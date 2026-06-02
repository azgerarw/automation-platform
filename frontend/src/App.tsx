import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './context/protectedRoute'
import PublicRoute from './context/publicRoute'
import AdminRoute from './context/adminRoute'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'

function App() {


  return (
    <>
     
       <BrowserRouter>
          <Routes>
              <Route element={<Layout />}>
              <Route index element={<Home />} />
                
                {/* Public routes */}
                  <Route 
                    path="/Login" 
                    element={<PublicRoute><Login /></PublicRoute>} 
                  />
                  <Route 
                    path="/Register" 
                    element={<PublicRoute><Register /></PublicRoute>} 
                  />
                
                {/* Protected routes */}
                  <Route 
                  path="/Profile" 
                  element={<ProtectedRoute><Profile /></ProtectedRoute>} 
                  />
                  <Route 
                  path="/Dashboard" 
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                  />
                  <Route
                    path="/AdminPanel"
                    element={<AdminRoute><AdminPanel /></AdminRoute>}
                  />
              </Route>
          </Routes>
        </BrowserRouter>
      
    </>
  )
}

export default App
