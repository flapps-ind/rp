import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1a] px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Registration Complete!</h1>
        <p className="text-gray-400 mb-8">
          Please check your email to verify your account before logging in.
        </p>

        <div className="bg-[#111827]/50 border border-[#1e3a5f] rounded-xl p-6 mb-6">
          <Mail className="w-8 h-8 text-[#2196f3] mx-auto mb-4" />
          <p className="text-sm text-gray-400">
            We&apos;ve sent a confirmation email to your inbox. Click the link in the email to activate your account.
          </p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white font-semibold">
            GO TO LOGIN
          </Button>
        </Link>
      </div>
    </div>
  )
}
