"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface GeolocationPosition {
  lat: number
  lng: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
  timestamp: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  maximumAge?: number
  timeout?: number
  watchPosition?: boolean
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null
  error: GeolocationError | null
  loading: boolean
  supported: boolean
  permissionStatus: PermissionState | null
  requestPermission: () => Promise<boolean>
  startWatching: () => void
  stopWatching: () => void
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
  watchPosition: true,
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const opts = { ...defaultOptions, ...options }
  
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)
  
  const watchIdRef = useRef<number | null>(null)
  const supported = typeof window !== "undefined" && "geolocation" in navigator

  const handleSuccess = useCallback((pos: globalThis.GeolocationPosition) => {
    const { coords, timestamp } = pos
    setPosition({
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      altitudeAccuracy: coords.altitudeAccuracy,
      heading: coords.heading,
      speed: coords.speed,
      timestamp,
    })
    setError(null)
    setLoading(false)
  }, [])

  const handleError = useCallback((err: globalThis.GeolocationPositionError) => {
    let message = "Unknown error"
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = "Location permission denied. Please enable location access in your browser settings."
        break
      case err.POSITION_UNAVAILABLE:
        message = "Location information is unavailable. Please check your device's GPS."
        break
      case err.TIMEOUT:
        message = "Location request timed out. Please try again."
        break
    }
    setError({ code: err.code, message })
    setLoading(false)
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) return false
    
    try {
      // Try to get a single position to trigger permission prompt
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            handleSuccess(pos)
            resolve(true)
          },
          (err) => {
            handleError(err)
            resolve(false)
          },
          {
            enableHighAccuracy: opts.enableHighAccuracy,
            maximumAge: opts.maximumAge,
            timeout: opts.timeout,
          }
        )
      })
    } catch {
      return false
    }
  }, [supported, opts.enableHighAccuracy, opts.maximumAge, opts.timeout, handleSuccess, handleError])

  const startWatching = useCallback(() => {
    if (!supported || watchIdRef.current !== null) return

    setLoading(true)
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        maximumAge: opts.maximumAge,
        timeout: opts.timeout,
      }
    )
  }, [supported, opts.enableHighAccuracy, opts.maximumAge, opts.timeout, handleSuccess, handleError])

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  // Check permission status
  useEffect(() => {
    if (!supported) return

    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" })
        setPermissionStatus(result.state)
        
        result.addEventListener("change", () => {
          setPermissionStatus(result.state)
        })
      } catch {
        // Permissions API not supported in all browsers
      }
    }

    checkPermission()
  }, [supported])

  // Auto-start watching if enabled
  useEffect(() => {
    if (opts.watchPosition && supported) {
      startWatching()
    }

    return () => {
      stopWatching()
    }
  }, [opts.watchPosition, supported, startWatching, stopWatching])

  return {
    position,
    error,
    loading,
    supported,
    permissionStatus,
    requestPermission,
    startWatching,
    stopWatching,
  }
}

// Utility function to calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Calculate bearing between two points
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
  
  const bearing = Math.atan2(y, x)
  return ((bearing * 180) / Math.PI + 360) % 360
}
