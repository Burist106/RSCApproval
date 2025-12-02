/**
 * Footer Component
 * Site footer with logo, contact info, and social links
 */

const socialLinks = [
  { icon: 'fa-brands fa-facebook', href: '#' },
  { icon: 'fa-solid fa-globe', href: '#' },
  { icon: 'fa-solid fa-envelope', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white">
            <i className="fa-solid fa-shapes"></i>
          </div>
          <span className="text-white font-bold text-xl">RSC System</span>
        </div>

        {/* Description */}
        <p className="text-sm mb-6">
          ศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ<br />
          มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-6 text-xl mb-8">
          {socialLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.href} 
              className="hover:text-white transition"
            >
              <i className={link.icon}></i>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} King Mongkut's University of Technology Thonburi. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
