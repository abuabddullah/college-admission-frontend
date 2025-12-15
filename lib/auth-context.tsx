"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeUsers = () => {
      const usersData = localStorage.getItem("users")
      if (!usersData) {
        const demoUsers = [
          {
            id: "1",
            name: "John Doe",
            email: "demo@example.com",
            password: "password",
            avatar: "/diverse-user-avatars.png",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            password: "password",
            avatar: "/diverse-user-avatars.png",
          },
        ]
        localStorage.setItem("users", JSON.stringify(demoUsers))
        console.log("Demo users initialized:", demoUsers)
      } else {
        console.log("Existing users found:", JSON.parse(usersData))
      }
    }

    initializeUsers()

    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    console.log("Login attempt:", { email, password })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get users from localStorage
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    console.log("[] Available users:", users)

    // Find user
    const foundUser = users.find((u: User & { password: string }) => u.email === email && u.password === password)

    console.log("Found user:", foundUser)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get users from localStorage
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    // Check if user already exists
    const existingUser = users.find((u: User & { password: string }) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: `/placeholder.svg?height=100&width=100&query=user+avatar`,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
