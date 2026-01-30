"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Map,
  Car,
  Package,
  MessageSquare,
  Search,
  Bell,
  Settings,
  Radio,
  Battery,
  Hospital,
  Zap,
  Plus,
} from "lucide-react"

interface DashboardProps {
  onEmergencyRequest: () => void
  onNavigateToHistory: () => void
}

export function Dashboard({ onEmergencyRequest, onNavigateToHistory }: DashboardProps) {
  const [isAvailable, setIsAvailable] = useState(true)
  const [shiftTime, setShiftTime] = useState("04:22:15")
  const [activeNav, setActiveNav] = useState("tactical-map")

  // Simulate shift timer
  useEffect(() => {
    const interval = setInterval(() => {
      setShiftTime((prev) => {
        const parts = prev.split(":").map(Number)
        parts[2]++
        if (parts[2] >= 60) {
          parts[2] = 0
          parts[1]++
        }
        if (parts[1] >= 60) {
          parts[1] = 0
          parts[0]++
        }
        return parts.map((p) => p.toString().padStart(2, "0")).join(":")
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate emergency request after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAvailable) {
        onEmergencyRequest()
      }
    }, 3000)
    return () => clearTimeout(timeout)
  }, [isAvailable, onEmergencyRequest])

  const navItems = [
    { id: "tactical-map", icon: Map, label: "Tactical Map", active: true },
    { id: "vehicle-stats", icon: Car, label: "Vehicle Stats", active: false },
    { id: "inventory", icon: Package, label: "Inventory", active: false },
    { id: "messages", icon: MessageSquare, label: "Messages", badge: 3 },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo and Unit */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="currentColor">
              <polygon points="12,4 4,12 8,12 8,20 16,20 16,12 20,12" />
            </svg>
            <div>
              <h1 className="font-bold text-foreground">Ambulance OS</h1>
              <p className="text-xs text-muted-foreground tracking-wider">DRIVER TERMINAL</p>
            </div>
          </div>
        </div>

        {/* Unit Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Unit 42</h2>
              <p className="text-xs text-muted-foreground">ALS RESPONSE MOBILE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id)
                if (item.id === "messages") {
                  onNavigateToHistory()
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeNav === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Fuel and O2 Levels */}
        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground tracking-wider">FUEL LEVEL</span>
              <span className="text-foreground font-medium">88%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "88%" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground tracking-wider">O2 RESERVE</span>
              <span className="text-foreground font-medium">95%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "95%" }} />
            </div>
          </div>
        </div>

        {/* Radio Check Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button className="w-full h-12 bg-muted hover:bg-muted/80 text-foreground justify-start gap-3">
            <Radio className="w-5 h-5 text-primary" />
            Radio Check
          </Button>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent tracking-wider">DISPATCH CONNECTED</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <nav className="flex items-center gap-8">
            <button className="text-foreground font-medium border-b-2 border-primary pb-1">Dashboard</button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">Shift Log</button>
            <button
              onClick={onNavigateToHistory}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reports
            </button>
          </nav>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground tracking-wider">SHIFT TIMER</p>
              <p className="font-mono text-xl text-foreground">{shiftTime}</p>
            </div>
            <Button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`h-10 px-6 font-semibold ${
                isAvailable
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                  : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current mr-2" />
              {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
            </Button>
            <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 relative bg-muted/30">
          {/* Search Bar */}
          <div className="absolute top-4 left-4 z-10 w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search hospital or waypoint..."
                className="pl-11 h-12 bg-card border-border text-foreground"
              />
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-muted/50 flex items-center justify-center">
              <div className="flex items-center text-muted-foreground text-5xl font-light tracking-widest">
                <span>300</span>
                <Car className="w-8 h-8 mx-2 text-primary" />
                <span>300</span>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <button className="absolute bottom-32 right-4 w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="h-28 border-t border-border flex">
          <div className="flex-1 p-4 border-r border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground tracking-wider">ESTIMATED RANGE</span>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-semibold text-foreground">
              240 <span className="text-lg font-normal text-muted-foreground">miles</span>
            </p>
          </div>
          <div className="flex-1 p-4 border-r border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground tracking-wider">BATTERY HEALTH</span>
              <Battery className="w-4 h-4 text-accent" />
            </div>
            <p className="text-3xl font-semibold text-foreground">100%</p>
            <p className="text-xs text-accent">OPTIMAL PERFORMANCE</p>
          </div>
          <div className="flex-1 p-4 border-r border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground tracking-wider">CLOSEST TRAUMA CENTER</span>
              <Hospital className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-xl font-semibold text-foreground">St. Jude Medical</p>
            <p className="text-xs text-muted-foreground">1.2 MILES • 4 MINS</p>
          </div>
          <div className="flex-1 p-4 bg-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-primary tracking-wider">SYSTEM STATUS</span>
              <span className="w-2 h-2 bg-primary rounded-full" />
            </div>
            <p className="text-2xl font-bold text-foreground">READY</p>
            <p className="text-xs text-primary">WAITING FOR DISPATCH</p>
          </div>
        </div>
      </main>
    </div>
  )
}
