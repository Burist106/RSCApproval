import { Button } from '../ui'

/**
 * Navbar Component
 * Main navigation bar with logo and links
 * 
 * @param {function} onLoginClick - Login button click handler
 */

const navLinks = [
  { href: '#features', label: 'คุณสมบัติ' },
  { href: '#process', label: 'ขั้นตอนการใช้งาน' },
  { href: '#contact', label: 'ติดต่อเรา' },
]

export default function Navbar({ onLoginClick }) {
  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
              <i className="fa-solid fa-shapes"></i>
            </div>
            <div>
              <span className="font-bold text-xl text-slate-800 tracking-tight block">RSC Approval</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block -mt-1">KMUTT System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="hover:text-primary-500 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Login Button */}
          <Button variant="secondary" pill onClick={onLoginClick}>
            <i className="fa-solid fa-right-to-bracket"></i> เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    </nav>
  )
}
