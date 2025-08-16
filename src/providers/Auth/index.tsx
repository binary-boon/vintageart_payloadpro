// src/providers/Auth/index.tsx
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types for the authentication context - Based on your Users collection
interface User {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  roles?: string[]
  createdAt?: string
  updatedAt?: string
  // Add other properties based on your Users collection schema
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  register: (userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) => Promise<{ success: boolean; message?: string }>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component for Payload CMS
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      // Use Payload's built-in me endpoint
      const response = await fetch('/api/users/me', {
        method: 'POST',
        credentials: 'include', // Important for Payload's cookie-based auth
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)

      // Use Payload's built-in login endpoint for Users collection
      const response = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return {
          success: false,
          message: data.message || 'Invalid email or password',
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Use Payload's built-in logout endpoint
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)

      // Use Payload's built-in create user endpoint
      const response = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok && data.doc) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password)
        return loginResult
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed',
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
