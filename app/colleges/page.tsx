"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockColleges } from "@/lib/mock-data"
import { Star, MapPin, Search } from "lucide-react"

export default function CollegesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredColleges = mockColleges.filter(
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
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
                    <span className="font-semibold">{college.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({college.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {college.courses.slice(0, 2).map((course) => (
                    <Badge key={course} variant="secondary">
                      {course}
                    </Badge>
                  ))}
                  {college.courses.length > 2 && <Badge variant="outline">+{college.courses.length - 2} more</Badge>}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/colleges/${college.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No colleges found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
