"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Download,
  Calendar,
  SlidersHorizontal,
  MapPin,
  Heart,
  Users,
  Wind,
  Baby,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface HistoryRecord {
  id: string
  status: string
  timestamp: string
  incident_type: string
  location: string
  duration: string
}

const mockHistory: HistoryRecord[] = [
  {
    id: "1",
    status: "Completed",
    timestamp: "14:20 - 14:55",
    incident_type: "Cardiac Arrest",
    location: "452 Oak St, North District",
    duration: "12m",
  },
  {
    id: "2",
    status: "Completed",
    timestamp: "13:05 - 13:40",
    incident_type: "Trauma",
    location: "88 Main Rd, City Center",
    duration: "9m",
  },
  {
    id: "3",
    status: "Cancelled",
    timestamp: "12:15 - 12:25",
    incident_type: "Minor Injury",
    location: "12 Link Blvd",
    duration: "5m",
  },
  {
    id: "4",
    status: "Completed",
    timestamp: "10:30 - 11:15",
    incident_type: "Respiratory",
    location: "902 Pine Ln",
    duration: "11m",
  },
  {
    id: "5",
    status: "Transferred",
    timestamp: "09:45 - 10:20",
    incident_type: "Maternity",
    location: "15 East Ave",
    duration: "14m",
  },
]

const incidentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Cardiac Arrest": Heart,
  Trauma: Users,
  "Minor Injury": AlertTriangle,
  Respiratory: Wind,
  Maternity: Baby,
}

export default function HistoryPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [history, setHistory] = useState<HistoryRecord[]>(mockHistory)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-500 bg-green-500/10 border-green-500/30"
      case "Cancelled":
        return "text-gray-400 bg-gray-400/10 border-gray-400/30"
      case "Transferred":
        return "text-[#2196f3] bg-[#2196f3]/10 border-[#2196f3]/30"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30"
    }
  }

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "Cardiac Arrest":
        return "text-red-500 bg-red-500/20"
      case "Trauma":
        return "text-pink-500 bg-pink-500/20"
      case "Minor Injury":
        return "text-purple-500 bg-purple-500/20"
      case "Respiratory":
        return "text-green-500 bg-green-500/20"
      case "Maternity":
        return "text-amber-500 bg-amber-500/20"
      default:
        return "text-gray-500 bg-gray-500/20"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <header className="bg-[#0d1421] border-b border-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2196f3]" fill="currentColor">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" transform="rotate(45 12 12)" />
              </svg>
              <span className="font-bold text-white">AmbulanceResponse</span>
            </div>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <span className="text-[#2196f3]">History</span>
              <span className="text-gray-400">Alerts</span>
              <span className="text-gray-400">Profile</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 bg-[#111827] border-[#1e3a5f] text-white placeholder:text-gray-500"
              />
            </div>
            <Link href="/dashboard">
              <Button className="bg-[#2196f3] hover:bg-[#1976d2] text-white">
                Back to Live Dashboard
              </Button>
            </Link>
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Request History Log</h1>
            <p className="text-gray-400 mt-1">
              Operational records for Vehicle #AMB-402 • Last updated: 2 mins ago
            </p>
          </div>
          <Button variant="outline" className="bg-transparent border-[#1e3a5f] text-white hover:bg-[#1e293b]">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111827] border border-[#1e3a5f] rounded-xl p-6">
            <p className="text-xs text-gray-400 tracking-wider mb-2">TOTAL CALLS TODAY</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">24</span>
              <span className="text-sm text-green-500">~12%</span>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#1e3a5f] rounded-xl p-6">
            <p className="text-xs text-gray-400 tracking-wider mb-2">AVG RESPONSE TIME</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">8m 42s</span>
              <span className="text-sm text-red-500">~5%</span>
            </div>
          </div>
          <div className="bg-[#111827] border border-[#1e3a5f] rounded-xl p-6">
            <p className="text-xs text-gray-400 tracking-wider mb-2">SUCCESS RATE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">98.2%</span>
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111827] border border-[#1e3a5f] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Calendar className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">FILTERS:</span>
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-[#2196f3] text-white" : "bg-transparent border-[#1e3a5f] text-white"}
                >
                  All Responses
                </Button>
                <Button
                  variant={filter === "critical" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("critical")}
                  className={filter === "critical" ? "bg-[#2196f3] text-white" : "bg-transparent border-[#1e3a5f] text-white"}
                >
                  Critical Only
                </Button>
              </div>
            </div>
            <Button className="bg-[#2196f3]/20 text-[#2196f3] hover:bg-[#2196f3]/30">
              <Search className="w-4 h-4 mr-2" />
              Filter Results
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111827] border border-[#1e3a5f] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  TIMESTAMP
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  INCIDENT TYPE
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  LOCATION
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  DURATION
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => {
                const Icon = incidentIcons[record.incident_type] || AlertTriangle
                return (
                  <tr key={record.id} className="border-b border-[#1e3a5f]/50 hover:bg-[#1a2332]">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          record.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{record.timestamp}</p>
                      <p className="text-xs text-gray-400">OCT 24, 2023</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIncidentColor(record.incident_type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-white">{record.incident_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4 text-[#2196f3]" />
                        {record.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{record.duration}</p>
                      <p className="text-xs text-gray-400">RESPONSE</p>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="link" className="text-[#2196f3] p-0 h-auto">
                        View Details
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#1e3a5f]">
            <p className="text-sm text-gray-400">SHOWING 1 TO 5 OF 24 RESULTS</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="bg-transparent border-[#1e3a5f] text-gray-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-[#2196f3] text-white">
                1
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-[#1e3a5f] text-white">
                2
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-[#1e3a5f] text-white">
                3
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent border-[#1e3a5f] text-gray-400 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-[#111827] border border-[#1e3a5f] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2196f3]/20 rounded-full flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-[#2196f3]" />
            </div>
            <div>
              <p className="text-white font-medium">Need to dispute a log entry?</p>
              <p className="text-sm text-gray-400">
                Operational adjustments must be requested via the Command Center supervisor.
              </p>
            </div>
          </div>
          <Button variant="link" className="text-[#2196f3]">
            Contact Support
          </Button>
        </div>
      </main>
    </div>
  )
}
