import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../contexts'
import Sidebar from './Sidebar'

/**
 * AppLayout Component
 * Main layout wrapper for authenticated pages
 * Includes Sidebar navigation
 */

export default function AppLayout() {
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
          <p className="text-slate-500">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not logged in
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <i className="fa-solid fa-lock text-4xl text-slate-300 mb-4"></i>
          <p className="text-slate-500 mb-4">กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            ไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-slate-800">
            RSC <span className="text-primary-500">App</span>
          </span>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 shrink-0">
          <a href="/dashboard" className="flex flex-col items-center text-primary-500">
            <i className="fa-solid fa-chart-pie text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </a>
          <a href="/requests/new" className="flex flex-col items-center text-slate-400">
            <i className="fa-solid fa-plus-circle text-xl"></i>
            <span className="text-xs mt-1">สร้างใหม่</span>
          </a>
          <a href="/requests" className="flex flex-col items-center text-slate-400">
            <i className="fa-solid fa-folder text-xl"></i>
            <span className="text-xs mt-1">คำขอ</span>
          </a>
        </nav>
      </main>
    </div>
  )
}
