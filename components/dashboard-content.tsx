"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Map,
  Car,
  Package,
  MessageSquare,
  Search,
  Bell,
  Settings,
  Radio,
  Zap,
  Battery,
  Building2,
  Activity,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface Driver {
  id: string
  full_name: string | null
  unit_assignment: string | null
  status: string
  current_location: { lat: number; lng: number } | null
}

interface DashboardContentProps {
  user: User | null
  driver: Driver | null
  onStatusChange: (status: "available" | "busy" | "offline") => void
  onLogout: () => void
  onSimulateEmergency: () => void
}

export function DashboardContent({
  user,
  driver,
  onStatusChange,
  onLogout,
  onSimulateEmergency,
}: DashboardContentProps) {
  const [shiftTime, setShiftTime] = useState("04:22:15")
  const [fuelLevel] = useState(88)
  const [o2Reserve] = useState(95)
  
  const isUnavailable = driver?.status !== "available"

  // Shift timer
  useEffect(() => {
    const interval = setInterval(() => {
      setShiftTime((prev) => {
        const [h, m, s] = prev.split(":").map(Number)
        const totalSeconds = h * 3600 + m * 60 + s + 1
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { icon: Map, label: "Tactical Map", active: true },
    { icon: Car, label: "Vehicle Stats", active: false },
    { icon: Package, label: "Inventory", active: false },
    { icon: MessageSquare, label: "Messages", active: false, badge: 3 },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex relative">
      {/* Unavailable Overlay */}
      {isUnavailable && (
        <div className="absolute inset-0 z-40 bg-[#0a0f1a]/90 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center">
                <span className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">You are Unavailable</h2>
            <p className="text-gray-400 max-w-md">
              Your status is set to unavailable. You will not receive any emergency dispatches until you set yourself as available.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => onStatusChange("available")}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
            >
              <span className="w-3 h-3 bg-white rounded-full mr-3" />
              Set as Available
            </Button>
            
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-60 bg-[#0d1421] border-r border-[#1e3a5f] flex flex-col">
        {/* Logo & Unit Info */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3 mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2196f3]" fill="currentColor">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" transform="rotate(45 12 12)" />
            </svg>
            <div>
              <h1 className="font-bold text-white">Ambulance OS</h1>
              <p className="text-xs text-gray-400">DRIVER TERMINAL</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111827] rounded-lg">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-[#2196f3]" />
            </div>
            <div>
              <p className="text-white font-medium">{driver?.unit_assignment || "Unit 42"}</p>
              <p className="text-xs text-gray-400">ALS RESPONSE MOBILE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-[#2196f3]/10 text-[#2196f3]" : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#2196f3] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Vehicle Stats */}
        <div className="p-4 border-t border-[#1e3a5f] space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">FUEL LEVEL</span>
              <span className="text-white">{fuelLevel}%</span>
            </div>
            <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-[#2196f3] rounded-full" style={{ width: `${fuelLevel}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">O2 RESERVE</span>
              <span className="text-white">{o2Reserve}%</span>
            </div>
            <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${o2Reserve}%` }} />
            </div>
          </div>
        </div>

        {/* Radio Check & Dispatch */}
        <div className="p-4 border-t border-[#1e3a5f] space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-[#1e293b] border-[#1e3a5f] text-white hover:bg-[#2d3748]"
          >
            <Radio className="w-4 h-4" />
            Radio Check
          </Button>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500">DISPATCH CONNECTED</span>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#1e3a5f]">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-[#1e293b]"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-[#0d1421] border-b border-[#1e3a5f] flex items-center justify-between px-6">
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-white font-medium">
              Dashboard
            </Link>
            <Link href="/history" className="text-gray-400 hover:text-white">
              Shift Log
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">SHIFT TIMER</p>
              <p className="text-xl font-mono text-white">{shiftTime}</p>
            </div>

            <Button
              onClick={() => {
                const newStatus = isUnavailable ? "available" : "busy"
                onStatusChange(newStatus)
              }}
              className={`${
                isUnavailable
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              <span className="w-2 h-2 bg-white rounded-full mr-2" />
              {isUnavailable ? "UNAVAILABLE" : "AVAILABLE"}
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#1a2332]">
          {/* Search */}
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search hospital or waypoint..."
                className="w-80 pl-10 bg-[#111827] border-[#1e3a5f] text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Simulate Emergency Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={onSimulateEmergency}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Simulate Emergency
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-[#2196f3]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Map className="w-16 h-16 text-[#2196f3]/50" />
              </div>
              <p className="text-6xl font-light text-gray-500">300 x 300</p>
              <p className="text-gray-500 mt-2">Map View</p>
            </div>
          </div>

          {/* Bottom Stats Cards */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-4">
            <div className="flex-1 bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">ESTIMATED RANGE</span>
                <Zap className="w-4 h-4 text-[#2196f3]" />
              </div>
              <p className="text-2xl font-bold text-white">
                240 <span className="text-sm font-normal text-gray-400">miles</span>
              </p>
              <div className="h-1 bg-[#1e293b] rounded-full mt-2">
                <div className="h-full bg-[#2196f3] rounded-full w-3/4" />
              </div>
            </div>

            <div className="flex-1 bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">BATTERY HEALTH</span>
                <Battery className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-green-500 mt-1">OPTIMAL PERFORMANCE</p>
            </div>

            <div className="flex-1 bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">CLOSEST TRAUMA CENTER</span>
                <Building2 className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-lg font-bold text-white">St. Jude Medical</p>
              <p className="text-xs text-gray-400 mt-1">1.2 MILES • 4 MINS</p>
            </div>

            <div className="flex-1 bg-[#111827] border border-[#2196f3] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#2196f3]">SYSTEM STATUS</span>
                <Activity className="w-4 h-4 text-[#2196f3]" />
              </div>
              <p className="text-2xl font-bold text-white">READY</p>
              <p className="text-xs text-[#2196f3] mt-1">WAITING FOR DISPATCH</p>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-24 right-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
            >
              +
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
