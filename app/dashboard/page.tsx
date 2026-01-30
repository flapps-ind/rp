"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardContent } from "@/components/dashboard-content"
import { EmergencyRequestModal } from "@/components/emergency-request-modal"
import type { User } from "@supabase/supabase-js"

interface Driver {
  id: string
  full_name: string | null
  unit_assignment: string | null
  status: string
  current_location: { lat: number; lng: number } | null
}

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [emergencyRequest, setEmergencyRequest] = useState<EmergencyRequest | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      // Demo Mode Bypass
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        setUser({ id: 'demo-user', email: 'demo@example.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' })
        setDriver({
          id: 'demo-driver',
          full_name: 'John Doe',
          unit_assignment: 'Unit 42',
          status: 'available',
          current_location: { lat: 37.7749, lng: -122.4194 }
        })
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch driver profile
      const { data: driverData } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", user.id)
        .single()

      if (driverData) {
        setDriver(driverData)
      }

      setLoading(false)
    }

    getUser()

    // Subscribe to emergency requests for this driver
    const channel = supabase
      .channel("emergency-requests")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "emergency_requests",
        },
        (payload) => {
          const request = payload.new as EmergencyRequest
          // Show request if driver is available and no assigned driver or assigned to this driver
          if (driver?.status === "available" && (!request.status || request.status === "pending")) {
            setEmergencyRequest(request)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase, driver?.status])

  const handleStatusChange = async (status: "available" | "busy" | "offline") => {
    if (!user) return

    // In demo mode, just update local state
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      setDriver((prev) => (prev ? { ...prev, status } : null))
      return
    }

    const { error } = await supabase
      .from("drivers")
      .update({ status })
      .eq("id", user.id)

    if (!error) {
      setDriver((prev) => (prev ? { ...prev, status } : null))
    }
  }

  const handleAcceptRequest = useCallback(async () => {
    if (!emergencyRequest || !user) return

    const { error } = await supabase
      .from("emergency_requests")
      .update({
        assigned_driver_id: user.id,
        status: "accepted"
      })
      .eq("id", emergencyRequest.id)

    if (!error) {
      setEmergencyRequest(null)
      router.push(`/navigation/${emergencyRequest.id}`)
    }
  }, [emergencyRequest, user, supabase, router])

  const handleRejectRequest = useCallback(() => {
    setEmergencyRequest(null)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <DashboardContent
        user={user}
        driver={driver}
        onStatusChange={handleStatusChange}
        onLogout={handleLogout}
        onSimulateEmergency={() => setEmergencyRequest({
          id: "demo-" + Date.now(),
          incident_type: "Cardiac Arrest",
          location_address: "123 Medical Dr.",
          location_coords: { lat: 37.7749, lng: -122.4194 },
          priority: "critical",
          patient_info: null,
          status: "pending",
          created_at: new Date().toISOString()
        })}
      />

      {emergencyRequest && (
        <EmergencyRequestModal
          request={emergencyRequest}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}
    </>
  )
}
