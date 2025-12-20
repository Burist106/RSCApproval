import { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext(null)

// User accounts with credentials
const userAccounts = {
  researcher: {
    id: 1,
    username: 'researcher',
    password: 'rsc123',
    name: 'สมชาย ใจดี',
    email: 'somchai@kmutt.ac.th',
    role: 'researcher',
    roleLabel: 'B-Level (นักวิจัย)',
    department: 'ศูนย์ RSC',
  },
  director: {
    id: 2,
    username: 'director',
    password: 'rsc123',
    name: 'รศ.ดร.มานพ อนุมัติ',
    email: 'manop@kmutt.ac.th',
    role: 'director',
    roleLabel: 'A-Level (ผอ.ศูนย์)',
    department: 'ศูนย์ RSC',
  },
  admin: {
    id: 3,
    username: 'admin',
    password: 'rsc123',
    name: 'คุณสุดา ตรวจสอบ',
    email: 'suda@kmutt.ac.th',
    role: 'admin',
    roleLabel: 'Admin (เจ้าหน้าที่)',
    department: 'ศูนย์ RSC',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rsc_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('rsc_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Login with username/password
  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by username
        const userAccount = Object.values(userAccounts).find(
          (u) => u.username === username
        )

        if (!userAccount) {
          reject(new Error('ไม่พบชื่อผู้ใช้งานนี้ในระบบ'))
          return
        }

        if (userAccount.password !== password) {
          reject(new Error('รหัสผ่านไม่ถูกต้อง'))
          return
        }

        // Create user object without password
        const { password: _, ...userWithoutPassword } = userAccount
        setUser(userWithoutPassword)
        localStorage.setItem('rsc_user', JSON.stringify(userWithoutPassword))
        resolve(userWithoutPassword)
      }, 500)
    })
  }

  // Login as demo user (kept for backward compatibility)
  const loginAsDemo = (role) => {
    const userAccount = userAccounts[role]
    if (userAccount) {
      const { password: _, ...userWithoutPassword } = userAccount
      setUser(userWithoutPassword)
      localStorage.setItem('rsc_user', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    }
    return null
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('rsc_user')
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginAsDemo,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
