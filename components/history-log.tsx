"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  AlertTriangle,
  Baby,
  Activity,
  Stethoscope,
  Info,
  User,
} from "lucide-react"

interface HistoryLogProps {
  onBack: () => void
}

const historyData = [
  {
    id: 1,
    status: "Completed",
    timestamp: "14:20 - 14:55",
    date: "OCT 24, 2023",
    type: "Cardiac Arrest",
    icon: Heart,
    iconColor: "text-destructive",
    location: "452 Oak St, North District",
    duration: "12m",
  },
  {
    id: 2,
    status: "Completed",
    timestamp: "13:05 - 13:40",
    date: "OCT 24, 2023",
    type: "Trauma",
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    location: "88 Main Rd, City Center",
    duration: "9m",
  },
  {
    id: 3,
    status: "Cancelled",
    timestamp: "12:15 - 12:25",
    date: "OCT 24, 2023",
    type: "Minor Injury",
    icon: Stethoscope,
    iconColor: "text-primary",
    location: "12 Link Blvd",
    duration: "5m",
  },
  {
    id: 4,
    status: "Completed",
    timestamp: "10:30 - 11:15",
    date: "OCT 24, 2023",
    type: "Respiratory",
    icon: Activity,
    iconColor: "text-accent",
    location: "902 Pine Ln",
    duration: "11m",
  },
  {
    id: 5,
    status: "Transferred",
    timestamp: "09:45 - 10:20",
    date: "OCT 24, 2023",
    type: "Maternity",
    icon: Baby,
    iconColor: "text-pink-500",
    location: "15 East Ave",
    duration: "14m",
  },
]

export function HistoryLog({ onBack }: HistoryLogProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-accent border-accent"
      case "Cancelled":
        return "text-muted-foreground border-muted-foreground"
      case "Transferred":
        return "text-primary border-primary"
      default:
        return "text-muted-foreground border-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-foreground text-lg">AmbulanceResponse</span>
            </div>
            <nav className="flex items-center gap-6">
              <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </button>
              <button className="text-primary font-medium">History</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Alerts</button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">Profile</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                className="pl-10 h-10 bg-input border-border text-foreground"
              />
            </div>
            <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Live Dashboard
            </Button>
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Request History Log</h1>
            <p className="text-muted-foreground mt-1">
              Operational records for Vehicle #AMB-402 • Last updated: 2 mins ago
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent border-border text-foreground hover:bg-muted">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground tracking-wider mb-2">TOTAL CALLS TODAY</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">24</span>
              <span className="text-sm text-accent">~12%</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground tracking-wider mb-2">AVG RESPONSE TIME</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">8m 42s</span>
              <span className="text-sm text-destructive">~5%</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground tracking-wider mb-2">SUCCESS RATE</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">98.2%</span>
              <span className="w-2 h-2 bg-accent rounded-full" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-muted-foreground text-sm">FILTERS:</span>
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    activeFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Responses
                </button>
                <button
                  onClick={() => setActiveFilter("critical")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    activeFilter === "critical"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Critical Only
                </button>
              </div>
            </div>
            <Button className="bg-primary/20 hover:bg-primary/30 text-primary gap-2">
              <Search className="w-4 h-4" />
              Filter Results
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border text-xs text-muted-foreground tracking-wider">
            <span>STATUS</span>
            <span>TIMESTAMP</span>
            <span>INCIDENT TYPE</span>
            <span>LOCATION</span>
            <span>DURATION</span>
            <span>ACTION</span>
          </div>

          {/* Table Rows */}
          {historyData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border items-center hover:bg-muted/50 transition-colors"
            >
              <div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(item.status)} bg-transparent`}
                >
                  {item.status}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-foreground">{item.timestamp}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                <span className="text-foreground">{item.type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{item.location}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{item.duration}</p>
                <p className="text-xs text-muted-foreground">RESPONSE</p>
              </div>
              <div>
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-muted-foreground text-sm">SHOWING 1 TO 5 OF 24 RESULTS</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                currentPage === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                currentPage === 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                currentPage === 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              3
            </button>
            <button className="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Help Banner */}
        <div className="mt-6 bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Need to dispute a log entry?</p>
              <p className="text-sm text-muted-foreground">
                Operational adjustments must be requested via the Command Center supervisor.
              </p>
            </div>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </main>
    </div>
  )
}
