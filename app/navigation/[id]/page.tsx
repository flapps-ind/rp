"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { NavigationMap } from "@/components/navigation-map"
import { useGeolocation, calculateDistance } from "@/hooks/use-geolocation"
import {
  Navigation,
  User,
  AlertTriangle,
  Settings,
  LogOut,
  CornerUpRight,
  CornerDownRight,
  CornerUpLeft,
  CornerDownLeft,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Heart,
  MapPin,
  GitFork,
  Building2,
  Phone,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
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

interface RouteStep {
  instruction: string
  distance: number
  duration: number
  maneuver: {
    type: string
    modifier?: string
    bearing_after?: number
  }
}

interface RouteData {
  distance: number
  duration: number
  steps: RouteStep[]
  geometry: [number, number][]
}

// Get maneuver icon based on type and modifier
function getManeuverIcon(type: string, modifier?: string) {
  const iconClass = "w-8 h-8 text-white"
  
  switch (type) {
    case "turn":
      if (modifier?.includes("right")) return <CornerUpRight className={iconClass} />
      if (modifier?.includes("left")) return <CornerUpLeft className={iconClass} />
      return <ArrowUp className={iconClass} />
    case "merge":
    case "on ramp":
    case "off ramp":
      if (modifier?.includes("right")) return <CornerDownRight className={iconClass} />
      if (modifier?.includes("left")) return <CornerDownLeft className={iconClass} />
      return <ArrowUp className={iconClass} />
    case "fork":
      if (modifier?.includes("right")) return <ArrowRight className={iconClass} />
      if (modifier?.includes("left")) return <ArrowLeft className={iconClass} />
      return <GitFork className={iconClass} />
    case "roundabout":
    case "rotary":
      return <RotateCcw className={iconClass} />
    case "arrive":
      return <MapPin className={iconClass} />
    case "depart":
    default:
      return <ArrowUp className={iconClass} />
  }
}

// Format distance for display
function formatDistance(meters: number): string {
  const miles = meters * 0.000621371
  if (miles < 0.1) {
    const feet = Math.round(meters * 3.28084)
    return `${feet} ft`
  }
  return `${miles.toFixed(1)} mi`
}

// Format duration for display
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export default function NavigationPage() {
  const [request, setRequest] = useState<EmergencyRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState<RouteData | null>(null)
  const [currentStep, setCurrentStep] = useState<RouteStep | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speed, setSpeed] = useState(0)
  
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  // Real GPS location
  const { 
    position, 
    error: geoError, 
    loading: geoLoading,
    supported: geoSupported,
    permissionStatus,
    requestPermission,
  } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
    watchPosition: true,
  })

  // Calculate speed from GPS or use provided speed
  useEffect(() => {
    if (position?.speed !== null && position?.speed !== undefined) {
      // Convert m/s to mph
      setSpeed(Math.round(position.speed * 2.237))
    }
  }, [position])

  // Fetch emergency request
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

  // Handle route updates
  const handleRouteUpdate = useCallback((newRoute: RouteData | null) => {
    setRoute(newRoute)
  }, [])

  // Handle current step change
  const handleCurrentStepChange = useCallback((step: RouteStep | null, index: number) => {
    if (step && voiceEnabled && step.instruction !== currentStep?.instruction) {
      // Use Web Speech API for voice navigation
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(step.instruction)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        speechSynthesis.speak(utterance)
      }
    }
    setCurrentStep(step)
    setCurrentStepIndex(index)
  }, [voiceEnabled, currentStep])

  // Open native navigation app
  const handleOpenExternalNav = () => {
    if (!request) return
    
    const { lat, lng } = request.location_coords
    
    // Try Google Maps first, then Apple Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    const appleMapsUrl = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
    
    // On iOS, try Apple Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, "_blank")
  }

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

  // Calculate distance to emergency
  const distanceToEmergency = position && request
    ? calculateDistance(
        position.lat,
        position.lng,
        request.location_coords.lat,
        request.location_coords.lng
      )
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // GPS Permission handling
  if (!geoSupported) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Geolocation Not Supported</h2>
          <p className="text-gray-400 mb-4">
            Your browser does not support geolocation. Please use a modern browser with GPS support.
          </p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (geoError && permissionStatus === "denied") {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Location Permission Required</h2>
          <p className="text-gray-400 mb-4">
            {geoError.message}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => requestPermission()} className="bg-[#2196f3] hover:bg-[#1976d2]">
              Request Permission
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Return to Dashboard
            </Button>
          </div>
        </div>
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

        {/* External Navigation */}
        <div className="p-4 border-t border-[#1e3a5f]">
          <Button 
            onClick={handleOpenExternalNav}
            className="w-full h-12 bg-green-500/20 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Open in Maps
          </Button>
        </div>

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
            <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
              {currentStep ? (
                getManeuverIcon(currentStep.maneuver.type, currentStep.maneuver.modifier)
              ) : (
                <ArrowUp className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">
                {currentStep?.instruction || "Calculating route..."}
              </h2>
              <p className="text-white/80">
                {currentStep 
                  ? `In ${formatDistance(currentStep.distance)} • Step ${currentStepIndex + 1} of ${route?.steps.length || 0}`
                  : geoLoading ? "Acquiring GPS signal..." : "Waiting for location..."
                }
              </p>
            </div>
            <div className="text-right bg-white/20 rounded-lg px-4 py-2">
              <p className="text-xs text-white/80">SPEED</p>
              <p className="text-2xl font-bold text-white">{speed}</p>
              <p className="text-xs text-white/80">mph</p>
            </div>
          </div>
        </div>

        {/* Voice Toggle */}
        <div className="absolute top-24 right-84 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b] ${
              voiceEnabled ? "" : "opacity-50"
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Interactive Map */}
        {request && (
          <NavigationMap
            driverPosition={position ? { lat: position.lat, lng: position.lng } : null}
            emergencyPosition={request.location_coords}
            onRouteUpdate={handleRouteUpdate}
            onCurrentStepChange={handleCurrentStepChange}
          />
        )}

        {/* Loading overlay while getting GPS */}
        {geoLoading && !position && (
          <div className="absolute inset-0 bg-[#0a0f1a]/80 flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#2196f3] animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Acquiring GPS Signal...</p>
              <p className="text-gray-400 text-sm mt-1">Please ensure location services are enabled</p>
            </div>
          </div>
        )}
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
                {route ? formatDuration(route.duration) : "--"}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {route ? "Live updating" : "Calculating..."}
              </p>
            </div>
            <div className="bg-[#111827] border border-[#1e3a5f] rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-2xl font-bold text-white">
                {route ? formatDistance(route.distance) : distanceToEmergency ? `${distanceToEmergency.toFixed(1)} mi` : "--"}
              </p>
              <p className="text-xs text-[#2196f3] mt-1">
                {route ? "Optimal Route" : "Direct line"}
              </p>
            </div>
          </div>
        </div>

        {/* GPS Status */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="bg-[#111827] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">GPS STATUS</span>
              <span className={`px-2 py-0.5 text-white text-xs rounded ${
                position ? "bg-green-500" : geoError ? "bg-red-500" : "bg-yellow-500"
              }`}>
                {position ? "LOCKED" : geoError ? "ERROR" : "ACQUIRING"}
              </span>
            </div>
            {position && (
              <div className="text-xs text-gray-400">
                <p>Accuracy: {Math.round(position.accuracy)}m</p>
                <p>Heading: {position.heading ? `${Math.round(position.heading)}°` : "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Vitals Monitor */}
        <div className="p-4 border-b border-[#1e3a5f]">
          <div className="bg-[#111827] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">PATIENT VITALS</span>
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
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <p className="text-lg font-bold text-white mb-3">
            Patient: {request?.patient_info?.gender || "Unknown"}, {request?.patient_info?.age || "--"}y
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4" />
              <span>{request?.incident_type || "Medical Emergency"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{request?.location_address || "Loading..."}</span>
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
              <Phone className="w-5 h-5" />
              <span className="text-xs">DISPATCH</span>
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
