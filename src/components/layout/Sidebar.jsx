import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Button } from '../ui'

/**
 * Sidebar Component
 * Navigation sidebar for authenticated app layout
 * 
 * @param {object} user - Current user object { name, role, avatar }
 * @param {function} onLogout - Logout handler
 */

// Menu items configuration by role
const menuItems = {
  researcher: [
    { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
    { path: '/requests/new', icon: 'fa-solid fa-circle-plus', label: 'สร้างคำขอใหม่' },
    { path: '/requests', icon: 'fa-solid fa-folder-open', label: 'คำขอของฉัน' },
  ],
  admin: [
    { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
    { path: '/admin/inbox', icon: 'fa-solid fa-list-check', label: 'รอตรวจสอบ', badge: true },
    { path: '/admin/reviewed', icon: 'fa-solid fa-check-double', label: 'ตรวจสอบแล้ว' },
  ],
  director: [
    { path: '/dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
    { path: '/director/pending', icon: 'fa-solid fa-file-signature', label: 'รออนุมัติ', badge: true },
    { path: '/director/approved', icon: 'fa-solid fa-stamp', label: 'อนุมัติแล้ว' },
  ],
}

// Role display config
const roleConfig = {
  researcher: { 
    label: 'นักวิจัย (B Level)', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
  },
  admin: { 
    label: 'เจ้าหน้าที่ (Admin)', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
  },
  director: { 
    label: 'ผอ.ศูนย์ (A Level)', 
    color: 'text-green-500',
    bgColor: 'bg-green-500',
  },
}

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const currentMenuItems = menuItems[user?.role] || menuItems.researcher
  const roleInfo = roleConfig[user?.role] || roleConfig.researcher

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/')
  }

  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-72'} 
      bg-white border-r border-slate-200 flex flex-col
      transition-all duration-300 ease-in-out shrink-0
    `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!isCollapsed && (
          <span className="text-lg font-bold text-slate-800">
            RSC <span className="text-primary-500">App</span>
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {!isCollapsed && (
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            เมนูหลัก
          </p>
        )}
        
        {currentMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition
              ${isActive 
                ? 'bg-linear-to-r from-primary-50 to-transparent border-l-4 border-primary-500 text-primary-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            {!isCollapsed && (
              <>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center gap-3 p-2 rounded-xl ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`w-10 h-10 rounded-full ${roleInfo.bgColor} flex items-center justify-center text-white font-bold`}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">
                {user?.name || 'Demo User'}
              </p>
              <p className={`text-xs truncate ${roleInfo.color}`}>
                {roleInfo.label}
              </p>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition p-2"
            title="ออกจากระบบ"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  )
}
