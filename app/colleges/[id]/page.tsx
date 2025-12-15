"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { mockColleges, mockReviews, type Review } from "@/lib/mock-data"
import { Star, MapPin, DollarSign, BookOpen, Building2, ArrowLeft } from "lucide-react"

export default function CollegeDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])

  const college = mockColleges.find((c) => c.id === id)

  useEffect(() => {
    const reviewsData = localStorage.getItem("reviews")
    const allReviews: Review[] = reviewsData ? JSON.parse(reviewsData) : mockReviews
    const collegeReviews = allReviews.filter((r) => r.collegeId === id)
    setReviews(collegeReviews)
  }, [id])

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

  const handleBookAdmission = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book admission.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    router.push(`/colleges/${id}/book`)
  }

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : college.rating

  const handleReviewSubmitted = () => {
    const reviewsData = localStorage.getItem("reviews")
    const allReviews: Review[] = reviewsData ? JSON.parse(reviewsData) : []
    const collegeReviews = allReviews.filter((r) => r.collegeId === id)
    setReviews(collegeReviews)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image src={college.image || "/placeholder.svg"} alt={college.name} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{college.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{college.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{avgRating}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{college.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Courses Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {college.courses.map((course) => (
                        <Badge key={course} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Facilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {college.facilities.map((facility) => (
                        <li key={facility} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {facility}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <div className="relative h-96 w-full rounded-lg overflow-hidden">
                  <Image
                    src={college.gallery[selectedImage] || "/placeholder.svg"}
                    alt="Gallery"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {college.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <ReviewForm collegeId={id} onReviewSubmitted={handleReviewSubmitted} />

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Student Reviews</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{review.userName}</p>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No reviews yet. Be the first to review!
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Admission Details</CardTitle>
                <CardDescription>Book your seat now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Admission Fee</span>
                  <span className="font-semibold flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {college.admissionFee}
                  </span>
                </div>
                <Button onClick={handleBookAdmission} className="w-full" size="lg">
                  Book Admission
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
