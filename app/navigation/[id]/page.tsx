"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Navigation,
  User,
  AlertTriangle,
  Settings,
  LogOut,
  CornerUpRight,
  Heart,
  MapPin,
  GitFork,
  Plus,
  Minus,
  Locate,
  Building2,
} from "lucide-react"

interface EmergencyRequest {
  id: string
  incident_type: string
  location_address: string
  location_coords: { lat: number; lng: number }
  priority: string
  patient_info: Record<string, unknown> | null
  status: string
}

export default function NavigationPage() {
  const [request, setRequest] = useState<EmergencyRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [eta, setEta] = useState(4)
  const [distance, setDistance] = useState(1.2)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchRequest = async () => {
      // Check if it's a demo request
      if (params.id?.toString().startsWith("demo-")) {
        setRequest({
          id: params.id as string,
          incident_type: "Cardiac Arrest",
          location_address: "155 Memorial Dr, Suite 4",
          location_coords: { lat: 42.3601, lng: -71.0589 },
          priority: "critical",
          patient_info: { age: 45, gender: "Male", condition: "Stable" },
          status: "accepted",
        })
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("emergency_requests")
        .select("*")
        .eq("id", params.id)
        .single()

      if (data) {
        setRequest(data)
      }
      setLoading(false)
    }

    fetchRequest()
  }, [params.id, supabase])

  // Simulate ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 0.02))
      setDistance((prev) => Math.max(0, prev - 0.005))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleArrive = async () => {
    if (request && !request.id.startsWith("demo-")) {
      await supabase
        .from("emergency_requests")
        .update({ status: "arrived" })
        .eq("id", request.id)
    }
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navItems = [
    { icon: Navigation, label: "Navigation", active: true },
    { icon: User, label: "Patient Info", active: false },
    { icon: AlertTriangle, label: "Traffic", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d1421] border-r border-[#1e3a5f] flex flex-col">
        {/* Unit Info */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2196f3] rounded-lg flex items-center justify-center text-white font-bold">
              A1
            </div>
            <div>
              <p className="text-white font-medium">Unit 102</p>
              <p className="text-xs text-[#2196f3]">ACTIVE RESPONSE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[#2196f3] text-white"
                  : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Emergency Button */}
        <div className="p-4">
          <Button className="w-full h-12 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            EMERGENCY
          </Button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#1e3a5f]">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-[#1e293b]"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        {/* Turn-by-Turn Direction */}
        <div className="absolute top-4 left-4 right-80 z-10">
          <div className="bg-[#2196f3] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CornerUpRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Turn Right onto Memorial Drive</h2>
              <p className="text-white/80">In 500 ft • High Traffic Area</p>
            </div>
            <div className="text-right bg-white/20 rounded-lg px-4 py-2">
              <p className="text-xs text-white/80">SPEED</p>
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-xs text-white/80">mph</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-[#1a2332]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47234.75761474!2d-71.1103!3d42.3601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3652d0d3d311b%3A0x787cbf240162e8a0!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Navigation Map"
          />
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-32 left-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#2196f3] border-[#2196f3] text-white hover:bg-[#1976d2]"
          >
            <Locate className="w-4 h-4" />
          </Button>
        </div>
      </main>

      {/* Right Panel */}
      <aside className="w-80 bg-[#0d1421] border-l border-[#1e3a5f] flex flex-col">
        {/* Mission Info */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <p className="text-xs text-[#2196f3] tracking-wider mb-1">ONGOING MISSION</p>
          <h2 className="text-xl font-bold text-white">Incident #{request?.id.slice(-5) || "29402"}</h2>
        </div>

        {/* ETA and Distance */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">ETA</p>
              <p className="text-2xl font-bold text-white">
                {Math.ceil(eta)} <span className="text-sm font-normal text-gray-400">mins</span>
              </p>
              <p className="text-xs text-green-500 mt-1">~ -1 min</p>
            </div>
            <div className="bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-2xl font-bold text-white">
                {distance.toFixed(1)} <span className="text-sm font-normal text-gray-400">mi</span>
              </p>
              <p className="text-xs text-[#2196f3] mt-1">Optimal Route</p>
            </div>
          </div>
        </div>

        {/* Vitals Monitor */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="bg-[#111827] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">LIVE</span>
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">LIVE</span>
            </div>
            {/* EKG Line */}
            <div className="h-16 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 60">
                <path
                  d="M0,30 L20,30 L25,30 L30,10 L35,50 L40,30 L60,30 L80,30 L85,30 L90,10 L95,50 L100,30 L120,30 L140,30 L145,30 L150,10 L155,50 L160,30 L180,30 L200,30 L205,30 L210,10 L215,50 L220,30 L240,30 L260,30 L265,30 L270,10 L275,50 L280,30 L300,30"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#2196f3] tracking-wider">PRIORITY STATUS</p>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-lg font-bold text-white mb-3">Patient: Male, 45y</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4" />
              <span>{request?.incident_type || "Cardiac Arrest"} (Stable)</span>
            </div>
            <p className="text-xs text-gray-500 ml-6">Live pulse monitoring active</p>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{request?.location_address || "155 Memorial Dr, Suite 4"}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent border-[#1e3a5f] text-white hover:bg-[#1e293b]"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs">TRAFFIC</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 bg-transparent border-[#1e3a5f] text-white hover:bg-[#1e293b]"
            >
              <GitFork className="w-5 h-5" />
              <span className="text-xs">REROUTE</span>
            </Button>
          </div>
        </div>

        {/* Arrive Button */}
        <div className="mt-auto p-4">
          <Button
            onClick={handleArrive}
            className="w-full h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white text-lg font-semibold"
          >
            <Building2 className="w-5 h-5 mr-2" />
            ARRIVED AT SCENE
          </Button>
        </div>
      </aside>
    </div>
  )
}
