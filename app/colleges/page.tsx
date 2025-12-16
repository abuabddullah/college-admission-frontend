"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { collegeAPI } from "@/lib/api"
import type { College } from "@/lib/types"
import { Star, MapPin, Search, Loader2, AlertCircle } from "lucide-react"

export default function CollegesPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await collegeAPI.getAll()
      setColleges(data)
    } catch (err) {
      console.error("Error fetching colleges:", err)
      setError("Failed to load colleges. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.courses.some((course) => course.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Colleges</h1>
          <p className="text-muted-foreground mb-6">Find the perfect college for your future</p>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => {
              const collegeId = college._id || college.id || ""
              return (
                <Card key={collegeId} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image src={college.image || "/placeholder.svg"} alt={college.name} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{college.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {college.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{college.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{college.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({college.type || "University"})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {college.courses.slice(0, 2).map((course) => (
                        <Badge key={course} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                      {college.courses.length > 2 && (
                        <Badge variant="outline">+{college.courses.length - 2} more</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/colleges/${collegeId}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        {!isLoading && !error && filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any colleges matching "{searchQuery}". Try a different search term.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
