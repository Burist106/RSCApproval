import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts'
import { Modal, IconBox, Button, Input, Divider } from './ui'

/**
 * LoginModal Component
 * Standard login modal with email/password form, register link, forget password
 * and Demo Mode for role selection
 * 
 * @param {boolean} isOpen - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {function} onRegister - Register handler
 * @param {function} onForgotPassword - Forgot password handler
 */

// Demo roles configuration
const demoRoles = [
  {
    id: 'researcher',
    icon: 'fa-solid fa-flask',
    color: 'blue',
    hoverBorder: 'hover:border-blue-500',
    hoverBg: 'hover:bg-blue-50',
    hoverText: 'hover:text-blue-700',
    title: 'นักวิจัย (B Level)',
    description: 'สร้างคำขอ / ติดตามสถานะ',
  },
  {
    id: 'admin',
    icon: 'fa-solid fa-user-check',
    color: 'purple',
    hoverBorder: 'hover:border-purple-500',
    hoverBg: 'hover:bg-purple-50',
    hoverText: 'hover:text-purple-700',
    title: 'เจ้าหน้าที่ (Admin)',
    description: 'ตรวจสอบเอกสาร / กรองงาน',
  },
  {
    id: 'director',
    icon: 'fa-solid fa-signature',
    color: 'green',
    hoverBorder: 'hover:border-green-500',
    hoverBg: 'hover:bg-green-50',
    hoverText: 'hover:text-green-700',
    title: 'ผอ.ศูนย์ (A Level)',
    description: 'อนุมัติ / ดู Dashboard งบฯ',
  },
]

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onRegister,
  onForgotPassword 
}) {
  const navigate = useNavigate()
  const { login, loginAsDemo } = useAuth()
  
  const [activeTab, setActiveTab] = useState('login') // 'login' | 'demo'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      onClose()
      navigate('/dashboard')
    } catch (error) {
      alert('เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (roleId) => {
    loginAsDemo(roleId)
    onClose()
    navigate('/dashboard')
  }

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword()
    }
  }

  const handleRegister = () => {
    if (onRegister) {
      onRegister()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      {/* Logo & Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-primary-200">
          <i className="fa-solid fa-shapes"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">ยินดีต้อนรับ</h2>
        <p className="text-slate-500 text-sm mt-1">RSC Smart Approval System</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'login'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <i className="fa-solid fa-right-to-bracket mr-2"></i>
          เข้าสู่ระบบ
        </button>
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'demo'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <i className="fa-solid fa-play mr-2"></i>
          Demo Mode
        </button>
      </div>

      {/* Login Tab Content */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="อีเมล"
            type="email"
            placeholder="your.email@kmutt.ac.th"
            icon="fa-solid fa-envelope"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="relative">
            <Input
              label="รหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon="fa-solid fa-lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 transition"
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600">จดจำฉัน</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium transition"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>

          {/* Login Button */}
          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-right-to-bracket"></i>
            )}
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>

          {/* Divider */}
          <Divider text="หรือ" className="my-4" />

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="md" className="w-full">
              <i className="fa-brands fa-google text-red-500"></i>
              Google
            </Button>
            <Button variant="outline" size="md" className="w-full">
              <i className="fa-brands fa-microsoft text-blue-500"></i>
              Microsoft
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500 mt-4">
            ยังไม่มีบัญชี?{' '}
            <button
              type="button"
              onClick={handleRegister}
              className="text-primary-500 hover:text-primary-600 font-semibold transition"
            >
              สมัครสมาชิก
            </button>
          </p>
        </form>
      )}

      {/* Demo Tab Content */}
      {activeTab === 'demo' && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-amber-800">โหมดทดสอบระบบ</p>
                <p className="text-xs text-amber-600 mt-1">
                  เลือกบทบาทด้านล่างเพื่อทดสอบการใช้งานระบบ โดยไม่ต้องล็อกอินจริง
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {demoRoles.map((role) => (
              <button 
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  w-full py-4 px-4 bg-white border-2 border-slate-100 
                  ${role.hoverBorder} ${role.hoverBg} text-slate-700 ${role.hoverText}
                  rounded-xl transition flex items-center gap-4 group text-left
                `}
              >
                <IconBox 
                  icon={role.icon} 
                  color={role.color} 
                  size="sm"
                  className="group-hover:scale-110 transition-transform"
                />
                <div className="flex-1">
                  <p className="font-bold">{role.title}</p>
                  <p className="text-xs text-slate-400">{role.description}</p>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-current transition"></i>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
