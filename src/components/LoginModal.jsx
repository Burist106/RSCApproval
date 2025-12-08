import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts'
import { Modal, Button, Input } from './ui'

/**
 * LoginModal Component
 * Login modal with username/password authentication
 * 
 * @param {boolean} isOpen - Show/hide modal
 * @param {function} onClose - Close handler
 */

export default function LoginModal({ 
  isOpen, 
  onClose
}) {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await login(username, password)
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setIsLoading(false)
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

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <Input
          label="ชื่อผู้ใช้งาน"
          type="text"
          placeholder="username"
          icon="fa-solid fa-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600">จดจำฉัน</span>
          </label>
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
      </form>
    </Modal>
  )
}
