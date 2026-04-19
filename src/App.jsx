import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary fallback={
      <div className="h-screen flex items-center justify-center bg-[#1a1a1a] text-gray-400 text-sm flex-col gap-2">
        <span>An unexpected error occurred.</span>
        <button className="text-[#20F3C7] underline" onClick={() => window.location.reload()}>Reload</button>
      </div>
    }>
    <div className="h-screen flex flex-col overflow-hidden bg-[#1a1a1a]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1 overflow-hidden">
                <Dashboard />
              </main>
            </>
          }
        />
      </Routes>
    </div>
    </ErrorBoundary>
  )
}
