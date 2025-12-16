"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { collegeAPI } from "@/lib/api"
import type { College, Review } from "@/lib/types"
import {
  Star,
  MapPin,
  DollarSign,
  BookOpen,
  Building2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  FileText,
  Trophy,
  ExternalLink,
  ClipboardCheck,
} from "lucide-react"

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [id, setId] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [college, setCollege] = useState<College | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchCollegeData()
  }, [id])

  const fetchCollegeData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const collegeData = await collegeAPI.getById(id)
      setCollege(collegeData)

      // Reviews are included in the college response
      if (collegeData.reviews) {
        setReviews(collegeData.reviews)
      }
    } catch (err) {
      console.error("Error fetching college:", err)
      setError("Failed to load college details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
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

  const handleReviewSubmitted = () => {
    fetchCollegeData()
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

  if (error || !college) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
            <Button onClick={() => router.push("/colleges")}>Back to Colleges</Button>
          </div>
        </div>
      </div>
    )
  }

  const collegeId = college._id || college.id || ""

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
                <span className="font-semibold">{college.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="admission">Admission</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
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
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Established:</span>
                        <span className="ml-2 font-medium">{college.established}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 font-medium">{college.type}</span>
                      </div>
                    </div>
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

              <TabsContent value="admission" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      Admission Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-lg">Application Steps</h4>
                      <ol className="space-y-3 ml-4">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            1
                          </span>
                          <div>
                            <strong>Complete Online Application</strong>
                            <p className="text-sm text-muted-foreground">
                              Fill out the application form with your personal and academic details
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            2
                          </span>
                          <div>
                            <strong>Submit Required Documents</strong>
                            <p className="text-sm text-muted-foreground">
                              Upload transcripts, test scores, letters of recommendation, and personal statement
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            3
                          </span>
                          <div>
                            <strong>Entrance Examination</strong>
                            <p className="text-sm text-muted-foreground">
                              Take the required entrance exam (dates will be communicated via email)
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            4
                          </span>
                          <div>
                            <strong>Interview (if applicable)</strong>
                            <p className="text-sm text-muted-foreground">
                              Attend an interview session with the admissions committee
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            5
                          </span>
                          <div>
                            <strong>Receive Admission Decision</strong>
                            <p className="text-sm text-muted-foreground">
                              Get your admission decision via email within 2-4 weeks
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-lg">Requirements</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>High school diploma or equivalent certificate</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Minimum GPA of 3.0 (or equivalent)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Standardized test scores (SAT/ACT for undergrad, GRE/GMAT for graduate)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>English proficiency test (TOEFL/IELTS for international students)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>Two letters of recommendation from teachers or counselors</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-lg">Important Deadlines</h4>
                      <div className="grid gap-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Early Decision</span>
                          <span className="text-muted-foreground">November 1</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Regular Decision</span>
                          <span className="text-muted-foreground">January 15</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="font-medium">Transfer Applications</span>
                          <span className="text-muted-foreground">March 1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">Annual Tech Fest 2025</h4>
                        <Badge>Upcoming</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Join us for our biggest technology festival featuring coding competitions, tech talks, and
                        workshops from industry leaders.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>March 15-17, 2025</span>
                      </div>
                    </div>

                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">Open House Day</h4>
                        <Badge>Upcoming</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Prospective students and parents are invited to tour campus, meet faculty, and learn about our
                        programs.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>February 10, 2025</span>
                      </div>
                    </div>

                    <div className="border-l-4 border-muted pl-4 py-2 opacity-75">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">Career Fair 2024</h4>
                        <Badge variant="secondary">Past</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Over 100 companies participated in our annual career fair, offering internships and full-time
                        positions to our students.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>November 20, 2024</span>
                      </div>
                    </div>

                    <div className="border-l-4 border-muted pl-4 py-2 opacity-75">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">Sports Championship</h4>
                        <Badge variant="secondary">Past</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Inter-college sports championship featuring cricket, basketball, football, and more. Our teams
                        won 5 gold medals!
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>October 5-12, 2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="research" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Research Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-semibold mb-2">
                        Artificial Intelligence in Healthcare: A Comprehensive Study
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Research on implementing machine learning algorithms for early disease detection and diagnosis
                        improvement in medical imaging.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Dr. Sarah Johnson, CS Department</span>
                        <Badge variant="outline">2024</Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-semibold mb-2">Sustainable Energy Solutions for Urban Development</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Innovative approaches to integrating renewable energy sources in city infrastructure and
                        reducing carbon footprint.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Prof. Michael Chen, Engineering</span>
                        <Badge variant="outline">2024</Badge>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-semibold mb-2">Quantum Computing Applications in Cryptography</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Exploring the potential of quantum algorithms in developing next-generation encryption methods
                        and secure communications.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Dr. Emily Rodriguez, Physics</span>
                        <Badge variant="outline">2023</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Sports & Athletics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          Cricket
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Full-sized cricket ground with professional turf wicket and practice nets
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• State-level championship winners (2023, 2024)</li>
                          <li>• Professional coaching available</li>
                          <li>• Indoor practice facility</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-orange-500" />
                          Basketball
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Two indoor basketball courts with modern flooring and equipment
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Inter-college tournament hosts</li>
                          <li>• Men's and women's teams</li>
                          <li>• Evening training sessions</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-green-500" />
                          Football
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          FIFA-standard football field with floodlights for evening matches
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Regional champions 2024</li>
                          <li>• Youth development program</li>
                          <li>• Goalkeeping training facility</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-blue-500" />
                          Swimming
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Olympic-size swimming pool with separate diving area
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Certified swimming instructors</li>
                          <li>• Competitive swimming team</li>
                          <li>• Year-round accessibility</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-purple-500" />
                          Tennis
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Six synthetic tennis courts with night lighting
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Professional tennis academy</li>
                          <li>• Regular inter-college matches</li>
                          <li>• Equipment rental available</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-red-500" />
                          Athletics Track
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          400m synthetic running track with field event facilities
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Long jump and high jump pits</li>
                          <li>• Shot put and javelin areas</li>
                          <li>• Annual athletics meet host</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Recommended Research Papers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Deep Learning Approaches to Natural Language Processing
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Johnson, S., Martinez, R., & Chen, L.</p>
                      <Badge variant="outline" className="text-xs">
                        2024 • Journal of AI Research
                      </Badge>
                    </a>

                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Renewable Energy Integration in Smart Grids
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Chen, M., & Thompson, K.</p>
                      <Badge variant="outline" className="text-xs">
                        2023 • Energy Systems Journal
                      </Badge>
                    </a>

                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Quantum Algorithms for Cryptographic Applications
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Rodriguez, E., & Wang, J.</p>
                      <Badge variant="outline" className="text-xs">
                        2023 • Quantum Information Processing
                      </Badge>
                    </a>

                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Machine Learning in Medical Diagnosis
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Anderson, P., Lee, H., & Kumar, R.</p>
                      <Badge variant="outline" className="text-xs">
                        2024 • Medical AI Journal
                      </Badge>
                    </a>

                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Blockchain Technology in Supply Chain Management
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Williams, T., & Zhang, Y.</p>
                      <Badge variant="outline" className="text-xs">
                        2023 • Business Technology Review
                      </Badge>
                    </a>

                    <a
                      href="https://scholar.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          Climate Change Impact on Urban Ecosystems
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Brown, D., Garcia, M., & Patel, S.</p>
                      <Badge variant="outline" className="text-xs">
                        2024 • Environmental Science Letters
                      </Badge>
                    </a>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                {college.gallery && college.gallery.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No gallery images available
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <ReviewForm collegeId={collegeId} onReviewSubmitted={handleReviewSubmitted} />

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Student Reviews</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
                      const reviewId = review._id || review.id || ""
                      return (
                        <Card key={reviewId}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{review.userName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                  </p>
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
                      )
                    })
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Tuition Fee (Annual)</span>
                  <span className="font-semibold flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {college.tuitionFee.toLocaleString()}
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
