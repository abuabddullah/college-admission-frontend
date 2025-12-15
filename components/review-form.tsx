"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/lib/mock-data"
import { Star } from "lucide-react"

interface ReviewFormProps {
  collegeId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ collegeId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get existing reviews
    const reviewsData = localStorage.getItem("reviews")
    const reviews: Review[] = reviewsData ? JSON.parse(reviewsData) : []

    // Create new review
    const newReview: Review = {
      id: Date.now().toString(),
      collegeId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "/placeholder.svg",
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    }

    reviews.push(newReview)
    localStorage.setItem("reviews", JSON.stringify(reviews))

    setIsSubmitting(false)
    setRating(0)
    setComment("")

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    })

    onReviewSubmitted()
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please login to leave a review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with this college</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this college..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
