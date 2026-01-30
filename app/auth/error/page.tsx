import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1a] px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-gray-400 mb-8">
          Something went wrong during authentication. Please try again.
        </p>

        <Link href="/auth/login">
          <Button className="w-full h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white font-semibold">
            BACK TO LOGIN
          </Button>
        </Link>
      </div>
    </div>
  )
}
