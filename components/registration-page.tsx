"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, CreditCard, Award as IdCard, Truck, ArrowLeft, ArrowRight, HelpCircle, FileText } from "lucide-react"

interface RegistrationPageProps {
  onBack: () => void
  onComplete: () => void
}

const steps = ["ACCOUNT", "CREDENTIALS", "UNIT SETUP", "VERIFICATION"]

export function RegistrationPage({ onBack, onComplete }: RegistrationPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    licenseNumber: "",
    certification: "",
    unitAssignment: "",
    certifyAccurate: false,
  })

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="currentColor">
              <polygon points="12,4 4,12 8,12 8,20 16,20 16,12 20,12" />
            </svg>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Ambulance OS</h1>
              <p className="text-xs text-muted-foreground tracking-wider">DRIVER ONBOARDING</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Already have an account?</span>
            <button onClick={onBack} className="text-primary hover:text-primary/80 font-medium">
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Title and Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Driver Registration</h2>
            <span className="text-primary font-medium">STEP {currentStep} OF 4</span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1 mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`text-xs tracking-wider ${
                  index < currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Account Information</h3>
                    <p className="text-sm text-muted-foreground">Create your login credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">EMAIL ADDRESS</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="driver@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-11 h-12 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">PASSWORD</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-11 h-12 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <IdCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Professional Credentials</h3>
                    <p className="text-sm text-muted-foreground">
                      Please provide your certification and license details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">FULL NAME</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Johnathan Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-11 h-12 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">DRIVER LICENSE NUMBER</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <Input
                        type="text"
                        placeholder="DL-9942001"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="pl-11 h-12 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">
                      CERTIFICATION (EMT/PARAMEDIC)
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <Input
                        type="text"
                        placeholder="EMT-44582-X"
                        value={formData.certification}
                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                        className="pl-11 h-12 bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs tracking-wider">UNIT ASSIGNMENT</Label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                      <Select
                        value={formData.unitAssignment}
                        onValueChange={(value) => setFormData({ ...formData, unitAssignment: value })}
                      >
                        <SelectTrigger className="pl-11 h-12 bg-input border-border text-foreground">
                          <SelectValue placeholder="Select assigned unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit-42">Unit 42 - ALS Response</SelectItem>
                          <SelectItem value="unit-102">Unit 102 - BLS Response</SelectItem>
                          <SelectItem value="unit-205">Unit 205 - Critical Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <Checkbox
                    id="certify"
                    checked={formData.certifyAccurate}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, certifyAccurate: checked as boolean })
                    }
                  />
                  <Label htmlFor="certify" className="text-sm text-muted-foreground leading-relaxed">
                    I certify that the information provided is accurate and I hold a valid state-issued
                    emergency medical technician certification.
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Unit Setup</h3>
                    <p className="text-sm text-muted-foreground">Configure your ambulance unit settings</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-center py-8">
                  Unit configuration will be completed by your dispatch supervisor.
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Verification Complete</h3>
                    <p className="text-sm text-muted-foreground">Your registration is being processed</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-center py-8">
                  Your account will be verified within 24-48 hours. You will receive an email confirmation.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="h-12 px-6 bg-transparent border-border text-foreground hover:bg-muted"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                BACK
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {currentStep === 4 ? "COMPLETE" : "NEXT STEP"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <HelpCircle className="w-4 h-4" />
            SUPPORT DESK
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <FileText className="w-4 h-4" />
            REQUIREMENTS
          </button>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-4 tracking-wider">
          SECURE PERSONNEL ENROLLMENT SYSTEM • V2.4.0
        </p>
      </footer>
    </div>
  )
}
