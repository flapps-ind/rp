"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Locate, Navigation2 } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface RouteStep {
  instruction: string
  distance: number // in meters
  duration: number // in seconds
  maneuver: {
    type: string
    modifier?: string
    bearing_after?: number
  }
}

interface RouteData {
  distance: number // total distance in meters
  duration: number // total duration in seconds
  steps: RouteStep[]
  geometry: [number, number][] // array of [lng, lat] coordinates
}

interface NavigationMapProps {
  driverPosition: Coordinates | null
  emergencyPosition: Coordinates
  onRouteUpdate?: (route: RouteData | null) => void
  onCurrentStepChange?: (step: RouteStep | null, stepIndex: number) => void
  mapboxToken?: string
}

export function NavigationMap({
  driverPosition,
  emergencyPosition,
  onRouteUpdate,
  onCurrentStepChange,
  mapboxToken,
}: NavigationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const driverMarkerRef = useRef<any>(null)
  const emergencyMarkerRef = useRef<any>(null)
  const routeLayerRef = useRef<boolean>(false)
  
  const [mapLoaded, setMapLoaded] = useState(false)
  const [route, setRoute] = useState<RouteData | null>(null)
  const [isFollowing, setIsFollowing] = useState(true)

  const token = mapboxToken || process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Fetch route from Mapbox Directions API
  const fetchRoute = useCallback(async (start: Coordinates, end: Coordinates) => {
    if (!token) return null

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?` +
        `alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${token}`
      )
      
      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0]
        const steps: RouteStep[] = routeData.legs[0].steps.map((step: any) => ({
          instruction: step.maneuver.instruction,
          distance: step.distance,
          duration: step.duration,
          maneuver: {
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
            bearing_after: step.maneuver.bearing_after,
          },
        }))

        const result: RouteData = {
          distance: routeData.distance,
          duration: routeData.duration,
          steps,
          geometry: routeData.geometry.coordinates,
        }

        return result
      }
    } catch (error) {
      console.error("Failed to fetch route:", error)
    }
    return null
  }, [token])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !token || mapRef.current) return

    const initMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default
      await import("mapbox-gl/dist/mapbox-gl.css")

      mapboxgl.accessToken = token

      const initialCenter = driverPosition || emergencyPosition

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/navigation-night-v1",
        center: [initialCenter.lng, initialCenter.lat],
        zoom: 15,
        pitch: 45,
        bearing: 0,
      })

      map.on("load", () => {
        setMapLoaded(true)

        // Add route source
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        })

        // Add route layer
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#2196f3",
            "line-width": 8,
            "line-opacity": 0.8,
          },
        })

        // Add route outline
        map.addLayer({
          id: "route-outline",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#1565c0",
            "line-width": 12,
            "line-opacity": 0.4,
          },
        }, "route")

        routeLayerRef.current = true
      })

      mapRef.current = map

      // Create emergency marker
      const emergencyEl = document.createElement("div")
      emergencyEl.className = "emergency-marker"
      emergencyEl.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
          animation: pulse 2s infinite;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `

      emergencyMarkerRef.current = new mapboxgl.Marker({
        element: emergencyEl,
        anchor: "center",
      })
        .setLngLat([emergencyPosition.lng, emergencyPosition.lat])
        .addTo(map)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [token, emergencyPosition])

  // Update driver marker and route
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !driverPosition) return

    const updateDriver = async () => {
      const mapboxgl = (await import("mapbox-gl")).default

      // Create or update driver marker
      if (!driverMarkerRef.current) {
        const driverEl = document.createElement("div")
        driverEl.innerHTML = `
          <div style="
            width: 48px;
            height: 48px;
            background: #2196f3;
            border: 4px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
          ">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style="transform: rotate(-45deg);">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
        `

        driverMarkerRef.current = new mapboxgl.Marker({
          element: driverEl,
          anchor: "center",
          rotationAlignment: "map",
        })
          .setLngLat([driverPosition.lng, driverPosition.lat])
          .addTo(mapRef.current)
      } else {
        driverMarkerRef.current.setLngLat([driverPosition.lng, driverPosition.lat])
      }

      // Follow driver position
      if (isFollowing) {
        mapRef.current.easeTo({
          center: [driverPosition.lng, driverPosition.lat],
          duration: 1000,
        })
      }

      // Fetch and update route
      const newRoute = await fetchRoute(driverPosition, emergencyPosition)
      if (newRoute) {
        setRoute(newRoute)
        onRouteUpdate?.(newRoute)

        // Update route on map
        if (routeLayerRef.current) {
          const source = mapRef.current.getSource("route")
          if (source) {
            source.setData({
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: newRoute.geometry,
              },
            })
          }
        }

        // Find current step based on driver position
        if (newRoute.steps.length > 0) {
          onCurrentStepChange?.(newRoute.steps[0], 0)
        }
      }
    }

    updateDriver()
  }, [driverPosition, mapLoaded, emergencyPosition, isFollowing, fetchRoute, onRouteUpdate, onCurrentStepChange])

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleRecenter = () => {
    if (mapRef.current && driverPosition) {
      setIsFollowing(true)
      mapRef.current.flyTo({
        center: [driverPosition.lng, driverPosition.lat],
        zoom: 16,
        pitch: 60,
        duration: 1000,
      })
    }
  }

  const handleFitRoute = () => {
    if (mapRef.current && route && route.geometry.length > 0) {
      const mapboxgl = require("mapbox-gl")
      const bounds = new mapboxgl.LngLatBounds()
      route.geometry.forEach((coord) => {
        bounds.extend(coord)
      })
      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      })
      setIsFollowing(false)
    }
  }

  // Add pulse animation style
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!token) {
    return (
      <div className="absolute inset-0 bg-[#1a2332] flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation2 className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Mapbox Token Required</h3>
          <p className="text-gray-400 text-sm">
            Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables to enable live navigation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Map Controls */}
      <div className="absolute bottom-32 left-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRecenter}
          className={`border-[#1e3a5f] text-white hover:bg-[#1e293b] ${
            isFollowing ? "bg-[#2196f3] border-[#2196f3]" : "bg-[#111827]"
          }`}
        >
          <Locate className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleFitRoute}
          className="bg-[#111827] border-[#1e3a5f] text-white hover:bg-[#1e293b]"
        >
          <Navigation2 className="w-4 h-4" />
        </Button>
      </div>
    </>
  )
}
