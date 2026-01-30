"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award as IdCard, Lock, ArrowRight, Phone, Wifi } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
  onRegister: () => void
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState("")
  const [pin, setPin] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 mb-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-primary" fill="currentColor">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.83L19.17 12H18v8h-4v-6H10v6H6v-8H4.83L12 4.83z" />
            <polygon points="12,4 4,12 8,12 8,20 16,20 16,12 20,12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Ambulance OS</h1>
        <p className="text-muted-foreground tracking-[0.3em] text-sm mt-1">DRIVER TERMINAL</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-muted-foreground text-xs tracking-wider">
                EMPLOYEE ID
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter ID number"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="pl-11 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-muted-foreground text-xs tracking-wider">
                PIN / PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-11 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
            >
              SIGN IN
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                Forgot PIN?
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Dispatch
              </button>
            </div>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onRegister}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            New driver? Register here
          </button>
        </div>
      </div>

      {/* Network Status */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <Wifi className="w-4 h-4" />
          <span className="tracking-wider">NETWORK SECURE</span>
        </div>
        <p className="text-muted-foreground text-xs">
          Terminal ID: AMB-42-DASH | v4.2.0-STABLE
        </p>
      </div>
    </div>
  )
}
