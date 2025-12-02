import { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext(null)

// Demo users for each role
const demoUsers = {
  researcher: {
    id: 1,
    name: 'ดร.สมชาย ใจดี',
    email: 'somchai@kmutt.ac.th',
    role: 'researcher',
    department: 'ศูนย์ RSC',
  },
  admin: {
    id: 2,
    name: 'คุณสุดา ตรวจสอบ',
    email: 'suda@kmutt.ac.th',
    role: 'admin',
    department: 'ศูนย์ RSC',
  },
  director: {
    id: 3,
    name: 'รศ.ดร.มานพ อนุมัติ',
    email: 'manop@kmutt.ac.th',
    role: 'director',
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

  // Login with email/password (mock)
  const login = async (email, password) => {
    // Mock login - in real app, call API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo, accept any email/password
        const mockUser = {
          ...demoUsers.researcher,
          email,
        }
        setUser(mockUser)
        localStorage.setItem('rsc_user', JSON.stringify(mockUser))
        resolve(mockUser)
      }, 500)
    })
  }

  // Login as demo user
  const loginAsDemo = (role) => {
    const demoUser = demoUsers[role]
    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem('rsc_user', JSON.stringify(demoUser))
      return demoUser
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
