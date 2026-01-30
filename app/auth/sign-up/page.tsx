"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, CreditCard, Award as IdCard, Truck, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

type Step = 1 | 2 | 3 | 4

export default function SignUpPage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    licenseNumber: "",
    certification: "",
    unitAssignment: "",
    certified: false,
  })

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          full_name: formData.fullName,
          license_number: formData.licenseNumber,
          certification: formData.certification,
          unit_assignment: formData.unitAssignment,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  const steps = [
    { label: "ACCOUNT", step: 1 },
    { label: "CREDENTIALS", step: 2 },
    { label: "UNIT SETUP", step: 3 },
    { label: "VERIFICATION", step: 4 },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <header className="border-b border-[#1e3a5f] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2196f3]" fill="currentColor">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" transform="rotate(45 12 12)" />
            </svg>
            <div>
              <h1 className="text-lg font-bold text-white">Ambulance OS</h1>
              <p className="text-xs text-gray-400">DRIVER ONBOARDING</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2196f3] hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Driver Registration</h2>
          <span className="text-[#2196f3] text-sm">STEP {step} OF 4</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-1 mb-2">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s.step <= step ? "bg-[#2196f3]" : "bg-[#1e3a5f]"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {steps.map((s) => (
              <span key={s.step} className={s.step === step ? "text-[#2196f3]" : ""}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#111827]/50 border border-[#1e3a5f] rounded-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2196f3]/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2196f3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Account Setup</h3>
                  <p className="text-sm text-gray-400">Create your login credentials</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">EMAIL ADDRESS</Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">PASSWORD</Label>
                  <Input
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">CONFIRM PASSWORD</Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2196f3]/20 rounded-lg flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-[#2196f3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Professional Credentials</h3>
                  <p className="text-sm text-gray-400">Please provide your certification and license details.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">FULL NAME</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Johnathan Doe"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="pl-10 bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">DRIVER LICENSE NUMBER</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2196f3]" />
                    <Input
                      placeholder="DL-9942001"
                      value={formData.licenseNumber}
                      onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                      className="pl-10 bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">CERTIFICATION (EMT/PARAMEDIC)</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2196f3]" />
                    <Input
                      placeholder="EMT-44582-X"
                      value={formData.certification}
                      onChange={(e) => updateFormData("certification", e.target.value)}
                      className="pl-10 bg-[#1a2332] border-[#1e3a5f] text-white placeholder:text-gray-500 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs tracking-wider text-gray-400">UNIT ASSIGNMENT</Label>
                  <Select value={formData.unitAssignment} onValueChange={(v) => updateFormData("unitAssignment", v)}>
                    <SelectTrigger className="bg-[#1a2332] border-[#1e3a5f] text-white h-12">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#2196f3]" />
                        <SelectValue placeholder="Select assigned unit" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2332] border-[#1e3a5f]">
                      <SelectItem value="unit-42">Unit 42 - ALS Response</SelectItem>
                      <SelectItem value="unit-102">Unit 102 - BLS Response</SelectItem>
                      <SelectItem value="unit-205">Unit 205 - Critical Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6">
                <Checkbox
                  id="certified"
                  checked={formData.certified}
                  onCheckedChange={(v) => updateFormData("certified", v as boolean)}
                  className="mt-1 border-[#1e3a5f] data-[state=checked]:bg-[#2196f3]"
                />
                <label htmlFor="certified" className="text-sm text-gray-400 leading-relaxed">
                  I certify that the information provided is accurate and I hold a valid state-issued emergency medical
                  technician certification.
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#2196f3]/20 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#2196f3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Unit Setup</h3>
                  <p className="text-sm text-gray-400">Configure your vehicle and equipment preferences</p>
                </div>
              </div>

              <div className="bg-[#1a2332] border border-[#1e3a5f] rounded-lg p-6 text-center">
                <Truck className="w-12 h-12 text-[#2196f3] mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">Unit Configuration</h4>
                <p className="text-gray-400 text-sm">
                  Your unit assignment will be configured by dispatch after verification.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Verification</h3>
                  <p className="text-sm text-gray-400">Review your information and complete registration</p>
                </div>
              </div>

              <div className="bg-[#1a2332] border border-[#1e3a5f] rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name</span>
                  <span className="text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">License</span>
                  <span className="text-white">{formData.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Certification</span>
                  <span className="text-white">{formData.certification}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex-1 h-14 bg-transparent border-[#1e3a5f] text-white hover:bg-[#1e3a5f]"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                BACK
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => (s + 1) as Step)}
                className="flex-1 h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white font-semibold"
              >
                NEXT STEP
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-14 bg-[#2196f3] hover:bg-[#1976d2] text-white font-semibold"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "COMPLETE REGISTRATION"}
              </Button>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
          <button className="hover:text-white flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">
              ?
            </span>
            SUPPORT DESK
          </button>
          <button className="hover:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            REQUIREMENTS
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e3a5f] py-4 mt-auto">
        <p className="text-center text-xs text-gray-500">SECURE PERSONNEL ENROLLMENT SYSTEM • V2.4.0</p>
      </footer>
    </div>
  )
}
