"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award as IdCard, Lock, ArrowRight, Phone, Wifi, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1a] px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 mb-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#2196f3]" fill="currentColor">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" transform="rotate(45 12 12)" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">Ambulance OS</h1>
        <p className="text-sm tracking-[0.3em] text-gray-400 mt-1">DRIVER TERMINAL</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-[#111827]/50 border border-[#1e3a5f] rounded-xl p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs tracking-wider text-gray-400">
              EMAIL ADDRESS
            </Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2196f3]" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs tracking-wider text-gray-400">
              PASSWORD
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2196f3]" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white font-semibold text-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                SIGN IN
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-gray-400 hover:text-white">
              Forgot Password?
            </button>
            <button type="button" className="text-gray-400 hover:text-white flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Dispatch
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-[#2196f3] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Network Status */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#111827]/50 border border-[#1e3a5f] rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-500 tracking-wider text-xs">NETWORK SECURE</span>
        </div>
      </div>

      {/* Terminal Info */}
      <p className="mt-4 text-xs text-gray-500">
        Terminal ID: AMB-42-DASH | v4.2.0-STABLE
      </p>
    </div>
  )
}
