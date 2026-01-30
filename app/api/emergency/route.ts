import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST /api/emergency - Receive emergency request from consumer app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { lat, lng, patientName, priority, incidentType, address } = body
    
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "Invalid coordinates. lat and lng must be numbers." },
        { status: 400 }
      )
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Coordinates out of range. lat: -90 to 90, lng: -180 to 180." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create emergency request in database
    const emergencyRequest = {
      incident_type: incidentType || "Medical Emergency",
      location_address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      location_coords: { lat, lng },
      priority: priority?.toLowerCase() || "high",
      patient_info: patientName ? { name: patientName } : null,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("emergency_requests")
      .insert(emergencyRequest)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to create emergency request", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Emergency request created and broadcasted to available drivers",
      requestId: data.id,
      data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/emergency - Get pending emergency requests (for polling fallback)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get("driverId")

    const query = supabase
      .from("emergency_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10)

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch emergency requests" },
        { status: 500 }
      )
    }

    return NextResponse.json({ requests: data })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
