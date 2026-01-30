import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerClient } from "@supabase/supabase-js"

// Create a service role client for API routes (bypasses RLS for inserts from consumer app)
function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration")
  }
  
  return createServerClient(supabaseUrl, supabaseServiceKey)
}

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

    const supabase = createServiceClient()

    // Create emergency in the emergencies table (matches new schema)
    const emergency = {
      lat,
      lng,
      patient_name: patientName || null,
      priority: priority?.toLowerCase() || "high",
      incident_type: incidentType || "Medical Emergency",
      address: address || null,
      status: "pending",
    }

    const { data, error } = await supabase
      .from("emergencies")
      .insert(emergency)
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
      emergencyId: data.id,
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
export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10)

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

// PUT /api/emergency - Update emergency status (accept/complete)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { emergencyId, status, driverId } = body

    if (!emergencyId || !status) {
      return NextResponse.json(
        { error: "emergencyId and status are required" },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const updateData: Record<string, unknown> = { status }
    if (driverId) {
      updateData.assigned_driver_id = driverId
    }

    const { data, error } = await supabase
      .from("emergencies")
      .update(updateData)
      .eq("id", emergencyId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Failed to update emergency", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
