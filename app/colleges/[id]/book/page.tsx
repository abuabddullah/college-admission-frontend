"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { mockColleges, type Booking } from "@/lib/mock-data"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function BookAdmissionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const college = mockColleges.find((c) => c.id === id)

  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    phone: "",
    course: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get existing bookings
    const bookingsData = localStorage.getItem("bookings")
    const bookings: Booking[] = bookingsData ? JSON.parse(bookingsData) : []

    // Create new booking
    const newBooking: Booking = {
      id: Date.now().toString(),
      collegeId: college.id,
      collegeName: college.name,
      userId: user.id,
      studentName: formData.studentName,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      status: "pending",
      date: new Date().toISOString(),
    }

    bookings.push(newBooking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    setIsSubmitting(false)

    toast({
      title: "Booking Successful!",
      description: "Your admission booking has been submitted.",
    })

    router.push("/my-bookings")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

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
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
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
                <Label htmlFor="course">Select Course</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
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

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Admission Fee</span>
                  <span className="text-2xl font-bold">${college.admissionFee}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a booking fee. Full tuition details will be provided after confirmation.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !formData.course}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
