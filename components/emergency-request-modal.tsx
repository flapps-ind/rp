"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Navigation, Clock, Wifi, Asterisk } from "lucide-react"

interface EmergencyRequest {
  id: string
  incident_type: string
  location_address: string
  location_coords: { lat: number; lng: number }
  priority: string
  patient_info: Record<string, unknown> | null
  status: string
  created_at: string
}

interface EmergencyRequestModalProps {
  request?: EmergencyRequest
  onAccept: () => void
  onReject: () => void
}

export function EmergencyRequestModal({ request, onAccept, onReject }: EmergencyRequestModalProps) {
  const [time, setTime] = useState("09:42 AM")

  useEffect(() => {
    const now = new Date()
    setTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    )
  }, [])

  const incidentType = request?.incident_type || "Cardiac Arrest"
  const locationAddress = request?.location_address || "123 Medical Dr."
  const priority = request?.priority || "critical"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-200">
        {/* Critical Emergency Header */}
        <div className={`${priority === "critical" ? "bg-red-500" : "bg-orange-500"} rounded-t-xl p-6 text-center`}>
          <div className="flex items-center justify-center gap-2 text-white">
            <Asterisk className="w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-wider">
              {priority === "critical" ? "CRITICAL EMERGENCY" : "EMERGENCY"}
            </h1>
          </div>
          <p className="text-white/80 mt-1">INCOMING REQUEST: {time}</p>
        </div>

        {/* Content */}
        <div className="bg-[#111827] rounded-b-xl p-6">
          {/* Incident Info */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-400 tracking-wider mb-2">INCIDENT TYPE & LOCATION</p>
            <h2 className="text-2xl font-bold text-white">{incidentType} - {locationAddress}</h2>
          </div>

          {/* Distance and ETA */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1a2332] border border-[#1e3a5f] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
                <Navigation className="w-4 h-4" />
                <span className="text-xs tracking-wider">Distance</span>
              </div>
              <p className="text-3xl font-bold text-white">2.5 miles</p>
            </div>
            <div className="bg-[#1a2332] border border-[#2196f3] rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-[#2196f3] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs tracking-wider">ETA</span>
              </div>
              <p className="text-3xl font-bold text-white">4 mins</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={onReject}
              variant="outline"
              className="h-14 bg-transparent border-[#1e3a5f] text-white hover:bg-[#1e293b] text-lg font-semibold"
            >
              <X className="w-5 h-5 mr-2" />
              REJECT
            </Button>
            <Button
              onClick={onAccept}
              className="h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold"
            >
              <Navigation className="w-5 h-5 mr-2 rotate-45" />
              ACCEPT
            </Button>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full" />
              <span>CASE #{request?.id.slice(0, 12) || "EMS-99120-X"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>NETWORK SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
