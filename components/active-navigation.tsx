"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Navigation,
  User,
  AlertTriangle,
  Settings,
  LogOut,
  Zap,
  MapPin,
  Heart,
  Activity,
  Plus,
  Minus,
  Crosshair,
  CornerDownRight,
  Hospital,
  GitBranch,
} from "lucide-react"

interface ActiveNavigationProps {
  onArrive: () => void
  onLogout: () => void
}

export function ActiveNavigation({ onArrive, onLogout }: ActiveNavigationProps) {
  const [eta, setEta] = useState(4)
  const [distance, setDistance] = useState(1.2)
  const [speed, setSpeed] = useState(42)
  const [activeNav, setActiveNav] = useState("navigation")

  // Simulate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(1, prev))
      setDistance((prev) => Math.max(0.1, prev - 0.01))
      setSpeed((prev) => Math.min(50, Math.max(30, prev + (Math.random() - 0.5) * 5)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { id: "navigation", icon: Navigation, label: "Navigation", active: true },
    { id: "patient", icon: User, label: "Patient Info", active: false },
    { id: "traffic", icon: AlertTriangle, label: "Traffic", active: false },
    { id: "settings", icon: Settings, label: "Settings", active: false },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Unit Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              A1
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Unit 102</h2>
              <p className="text-xs text-primary tracking-wider">ACTIVE RESPONSE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeNav === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Emergency Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button className="w-full h-12 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/50 justify-start gap-3">
            <Zap className="w-5 h-5" />
            EMERGENCY
          </Button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Turn Direction Banner */}
        <div className="absolute top-0 left-0 right-80 z-10">
          <div className="bg-primary m-4 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <CornerDownRight className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary-foreground">Turn Right onto Memorial Drive</h3>
              <p className="text-primary-foreground/80">In 500 ft • High Traffic Area</p>
            </div>
            <div className="text-right bg-primary-foreground/20 rounded-lg px-4 py-2">
              <p className="text-xs text-primary-foreground/80">SPEED</p>
              <p className="text-2xl font-bold text-primary-foreground">{Math.round(speed)}</p>
              <p className="text-xs text-primary-foreground/80">mph</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-muted/20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47170.93747227744!2d-71.0960503!3d42.3600825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3652d0d3d311b%3A0x787cbf240162e8a0!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1645564750986!5m2!1sen!2sus"
            className="w-full h-full border-0 opacity-80"
            allowFullScreen
            loading="lazy"
            title="Navigation Map"
          />
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-48 left-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <Minus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
            <Crosshair className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="w-80 bg-sidebar border-l border-sidebar-border flex flex-col">
        {/* Mission Info */}
        <div className="p-4 border-b border-sidebar-border">
          <p className="text-xs text-primary tracking-wider mb-1">ONGOING MISSION</p>
          <h2 className="text-2xl font-bold text-foreground">Incident #29402</h2>
        </div>

        {/* ETA and Distance */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-input border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">ETA</p>
              <p className="text-2xl font-bold text-foreground">
                {eta} <span className="text-sm font-normal">mins</span>
              </p>
              <p className="text-xs text-accent">~-1 min</p>
            </div>
            <div className="bg-input border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Distance</p>
              <p className="text-2xl font-bold text-foreground">
                {distance.toFixed(1)} <span className="text-sm font-normal">mi</span>
              </p>
              <p className="text-xs text-primary">Optimal Route</p>
            </div>
          </div>
        </div>

        {/* Vitals Monitor */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="bg-input border border-border rounded-lg p-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded">
              LIVE
            </div>
            {/* Simulated EKG */}
            <svg className="w-full h-16" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path
                d="M0,20 L20,20 L25,20 L30,5 L35,35 L40,10 L45,25 L50,20 L70,20 L75,20 L80,5 L85,35 L90,10 L95,25 L100,20 L120,20 L125,20 L130,5 L135,35 L140,10 L145,25 L150,20 L170,20 L175,20 L180,5 L185,35 L190,10 L195,25 L200,20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Patient Status */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-primary tracking-wider">PRIORITY STATUS</p>
            <Heart className="w-4 h-4 text-destructive animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Patient: Male, 45y</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Cardiac Arrest (Stable)</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">Live pulse monitoring active</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">155 Memorial Dr, Suite 4</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent border-border">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs">TRAFFIC</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent border-border">
              <GitBranch className="w-5 h-5" />
              <span className="text-xs">REROUTE</span>
            </Button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Arrived Button */}
        <div className="p-4">
          <Button
            onClick={onArrive}
            className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-semibold"
          >
            <Hospital className="w-5 h-5 mr-2" />
            ARRIVED AT SCENE
          </Button>
        </div>
      </aside>
    </div>
  )
}
