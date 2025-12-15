"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Booking, Review } from "@/lib/mock-data"
import { User, BookOpen, Star, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [userReviews, setUserReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Get user's bookings
    const bookingsData = localStorage.getItem("bookings")
    if (bookingsData) {
      const allBookings: Booking[] = JSON.parse(bookingsData)
      const filtered = allBookings.filter((b) => b.userId === user.id)
      setUserBookings(filtered)
    }

    // Get user's reviews
    const reviewsData = localStorage.getItem("reviews")
    if (reviewsData) {
      const allReviews: Review[] = JSON.parse(reviewsData)
      const filtered = allReviews.filter((r) => r.userId === user.id)
      setUserReviews(filtered)
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user in localStorage
    const usersData = localStorage.getItem("users")
    const users = usersData ? JSON.parse(usersData) : []

    const updatedUsers = users.map((u: { id: string }) => {
      if (u.id === user.id) {
        return { ...u, ...formData }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    const updatedUser = { ...user, ...formData }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })

    setIsEditing(false)
    window.location.reload()
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userReviews.length}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
                <Button variant="destructive" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                      </div>
                      {!isEditing && (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Save Changes</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setFormData({
                                name: user.name,
                                email: user.email,
                                phone: user.phone || "",
                              })
                              setIsEditing(false)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Phone</p>
                          <p className="font-medium">{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      My Admission Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userBookings.length > 0 ? (
                      <div className="space-y-4">
                        {userBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">{booking.collegeName}</h3>
                              <Badge variant={getStatusColor(booking.status)} className="capitalize">
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Course: {booking.course}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Applied on {new Date(booking.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No bookings yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      My Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userReviews.length > 0 ? (
                      <div className="space-y-4">
                        {userReviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No reviews yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
