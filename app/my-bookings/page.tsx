"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { Booking } from "@/lib/mock-data"
import { Calendar, BookOpen, Mail, Phone } from "lucide-react"

export default function MyBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Get user's bookings
    const bookingsData = localStorage.getItem("bookings")
    if (bookingsData) {
      const allBookings: Booking[] = JSON.parse(bookingsData)
      const userBookings = allBookings.filter((b) => b.userId === user.id)
      setBookings(userBookings)
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your admission applications</p>
        </div>

        {bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{booking.collegeName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(booking.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(booking.status)} className="capitalize">
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Course</p>
                          <p className="font-medium">{booking.course}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{booking.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{booking.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">Start exploring colleges and book your admission</p>
              <Button asChild>
                <Link href="/colleges">Browse Colleges</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
