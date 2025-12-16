"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "./api"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken")
      const storedUser = localStorage.getItem("currentUser")

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const userData = await authAPI.getProfile()
          setUser(userData)
          localStorage.setItem("currentUser", JSON.stringify(userData))
        } catch (error) {
          console.error("Auth initialization error:", error)
          // Token expired or invalid, clear storage
          localStorage.removeItem("authToken")
          localStorage.removeItem("currentUser")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authAPI.login({ email, password })

      // Store token and user data
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("currentUser", JSON.stringify(response.user))
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authAPI.register({ name, email, password })

      // Store token and user data
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("currentUser", JSON.stringify(response.user))
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
