import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { mockColleges } from "@/lib/mock-data"
import { Star, MapPin, ArrowRight, GraduationCap, Building2, Users } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const featuredColleges = mockColleges.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4" variant="secondary">
            Find Your Future
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Discover Top Colleges & Book Your Admission
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Browse through world-class institutions, explore facilities, read reviews, and book your admission all in
            one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/colleges">
                Browse Colleges
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Partner Colleges</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">50K+</h3>
              <p className="text-muted-foreground">Students Enrolled</p>
            </div>
            <div className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">1000+</h3>
              <p className="text-muted-foreground">Courses Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Colleges</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore some of the world's most prestigious institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredColleges.map((college) => (
              <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{college.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{college.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({college.reviewCount} reviews)</span>
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

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/colleges">
                View All Colleges
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Simple steps to book your admission</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Colleges</h3>
              <p className="text-muted-foreground">Explore colleges, view facilities, and read student reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Application</h3>
              <p className="text-muted-foreground">Fill out the admission form with your details and preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Confirmed</h3>
              <p className="text-muted-foreground">Receive confirmation and start your academic journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2025 CollegeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
