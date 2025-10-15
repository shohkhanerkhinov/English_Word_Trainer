"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, AlertCircle } from "lucide-react"

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    // Only letters and numbers, minimum 6 characters
    const passwordRegex = /^[a-zA-Z0-9]{6,}$/
    return passwordRegex.test(password)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters and contain only letters and numbers"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) {
      return
    }

    // Get users from localStorage
    const usersData = localStorage.getItem("englishTrainerUsers")
    const users = usersData ? JSON.parse(usersData) : []

    if (isLogin) {
      // Login logic
      const user = users.find((u) => u.email === formData.email && u.password === formData.password)

      if (user) {
        localStorage.setItem("englishTrainerCurrentUser", JSON.stringify(user))
        onLogin(user)
      } else {
        setMessage("Invalid email or password")
      }
    } else {
      // Register logic
      const existingUser = users.find((u) => u.email === formData.email)

      if (existingUser) {
        setMessage("User with this email already exists")
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // NOTE: In production, NEVER store passwords in localStorage!
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("englishTrainerUsers", JSON.stringify(users))
      localStorage.setItem("englishTrainerCurrentUser", JSON.stringify(newUser))
      onLogin(newUser)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">English Word Trainer</h1>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? "Welcome back! Login to continue learning" : "Create an account to start learning"}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={isLogin ? "default" : "outline"}
            onClick={() => {
              setIsLogin(true)
              setErrors({})
              setMessage("")
            }}
            className="flex-1"
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "default" : "outline"}
            onClick={() => {
              setIsLogin(false)
              setErrors({})
              setMessage("")
            }}
            className="flex-1"
          >
            Register
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters (letters & numbers only)"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {message}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            {isLogin ? "Don't have an account? Click Register above" : "Already have an account? Click Login above"}
          </p>
        </div>
      </Card>
    </div>
  )
}
