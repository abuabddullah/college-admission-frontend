"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { collegeAPI, bookingAPI } from "@/lib/api"
import type { College } from "@/lib/types"
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react"

export default function BookAdmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [id, setId] = useState<string>("")
  const [college, setCollege] = useState<College | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    course: "",
    previousEducation: "",
    grade: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
  })

  useEffect(() => {
    if (!id) return
    fetchCollege()
  }, [id])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        studentName: user.name,
        email: user.email,
        phone: user.phone || "",
      }))
    }
  }, [user])

  const fetchCollege = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await collegeAPI.getById(id)
      setCollege(data)
    } catch (err) {
      console.error("Error fetching college:", err)
      setError("Failed to load college details.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await bookingAPI.create({
        collegeId: id,
        ...formData,
      })

      toast({
        title: "Booking Successful!",
        description: "Your admission booking has been submitted.",
      })

      router.push("/my-bookings")
    } catch (err: any) {
      console.error("Booking error:", err)
      setError(err.message || "Failed to submit booking. Please try again.")
      toast({
        title: "Booking Failed",
        description: err.message || "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
          <Button onClick={() => router.push("/colleges")}>Back to Colleges</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Book Admission</CardTitle>
            </div>
            <CardDescription>Complete the form below to book your admission at {college.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Select Course *</Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => setFormData({ ...formData, course: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {college.courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previousEducation">Previous Education *</Label>
                  <Input
                    id="previousEducation"
                    type="text"
                    value={formData.previousEducation}
                    onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                    required
                    placeholder="High School, Bachelor's, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/GPA *</Label>
                  <Input
                    id="grade"
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                    placeholder="3.8 GPA or A+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name (Optional)</Label>
                  <Input
                    id="guardianName"
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone (Optional)</Label>
                  <Input
                    id="guardianPhone"
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Tuition Fee (Annual)</span>
                  <span className="text-2xl font-bold">${college.tuitionFee.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Full tuition details and payment plans will be provided after confirmation.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !formData.course}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
