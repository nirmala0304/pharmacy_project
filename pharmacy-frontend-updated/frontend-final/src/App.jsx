import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MedicineList from './pages/MedicineList'
import MedicineDetails from './pages/MedicineDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import UploadPrescription from './pages/UploadPrescription'
import PharmacistDashboard from './pages/PharmacistDashboard'
import PharmacistInquiries from './pages/PharmacistInquiries'
import UserProfile from './pages/UserProfile'
import ContactPage from './pages/ContactPage'
import MedicineInquiry from './pages/MedicineInquiry'
import AboutUs from './pages/AboutUs'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        <p style={{ color: 'var(--text-3)', marginTop: '1rem', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role && user.role !== 'ADMIN') return <Navigate to="/" />
  return children
}

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/medicines/:id" element={<MedicineDetails />} />

        {/* Public pages */}
        <Route path="/about"             element={<AboutUs />} />
        <Route path="/contact"           element={<ContactPage />} />
        <Route path="/medicines/inquiry" element={<MedicineInquiry />} />

        {/* Protected customer routes */}
        <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders"    element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/upload-prescription" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* Pharmacist / Admin routes */}
        <Route path="/pharmacist" element={
          <ProtectedRoute role="PHARMACIST"><PharmacistDashboard /></ProtectedRoute>
        } />
        <Route path="/pharmacist/inquiries" element={
          <ProtectedRoute role="PHARMACIST"><PharmacistInquiries /></ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN"><PharmacistDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/inquiries" element={
          <ProtectedRoute role="ADMIN"><PharmacistInquiries /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
