// Mock data for colleges
export interface College {
  id: string
  name: string
  location: string
  description: string
  image: string
  rating: number
  reviewCount: number
  courses: string[]
  facilities: string[]
  admissionFee: number
  gallery: string[]
}

export interface Review {
  id: string
  collegeId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}

export interface Booking {
  id: string
  collegeId: string
  collegeName: string
  userId: string
  studentName: string
  email: string
  phone: string
  course: string
  status: "pending" | "confirmed" | "rejected"
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
}

export const mockColleges: College[] = [
  {
    id: "1",
    name: "Stanford University",
    location: "Stanford, California",
    description: "A leading research university known for its entrepreneurial spirit and academic excellence.",
    image: "/stanford-university-campus.png",
    rating: 4.8,
    reviewCount: 245,
    courses: ["Computer Science", "Business", "Engineering", "Medicine"],
    facilities: ["Library", "Sports Complex", "Research Labs", "Cafeteria", "Hostel"],
    admissionFee: 500,
    gallery: [
      "/university-library-interior.png",
      "/university-sports-complex.jpg",
      "/university-lab.jpg",
      "/university-cafeteria.jpg",
    ],
  },
  {
    id: "2",
    name: "MIT",
    location: "Cambridge, Massachusetts",
    description: "World-renowned for technology and innovation, fostering groundbreaking research.",
    image: "/mit-campus-building.jpg",
    rating: 4.9,
    reviewCount: 312,
    courses: ["AI & Robotics", "Physics", "Mathematics", "Computer Science"],
    facilities: ["Advanced Labs", "Innovation Hub", "Library", "Student Center"],
    admissionFee: 550,
    gallery: [
      "/mit-robotics-lab.jpg",
      "/university-innovation-center.jpg",
      "/modern-university-library.png",
      "/student-study-area.jpg",
    ],
  },
  {
    id: "3",
    name: "Harvard University",
    location: "Cambridge, Massachusetts",
    description: "Oldest institution of higher learning in the US, offering diverse programs.",
    image: "/harvard-university-yard.jpg",
    rating: 4.7,
    reviewCount: 289,
    courses: ["Law", "Business", "Medicine", "Liberal Arts"],
    facilities: ["Historical Library", "Medical Center", "Art Museum", "Athletic Facilities"],
    admissionFee: 480,
    gallery: [
      "/harvard-library-interior.jpg",
      "/university-medical-center.jpg",
      "/university-art-museum.jpg",
      "/university-athletic-field.jpg",
    ],
  },
  {
    id: "4",
    name: "Oxford University",
    location: "Oxford, United Kingdom",
    description: "Historic university with centuries of academic tradition and excellence.",
    image: "/oxford-university-architecture.jpg",
    rating: 4.8,
    reviewCount: 267,
    courses: ["Philosophy", "Literature", "History", "Sciences"],
    facilities: ["Ancient Libraries", "Research Centers", "Dining Halls", "Gardens"],
    admissionFee: 520,
    gallery: [
      "/oxford-bodleian-library.jpg",
      "/oxford-college-dining-hall.jpg",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
]

export const mockReviews: Review[] = [
  {
    id: "1",
    collegeId: "1",
    userId: "1",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Amazing campus facilities and excellent faculty. The entrepreneurial culture here is truly inspiring!",
    date: "2024-12-10",
  },
  {
    id: "2",
    collegeId: "1",
    userId: "2",
    userName: "Michael Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Great research opportunities and beautiful campus. Housing could be more affordable though.",
    date: "2024-12-08",
  },
  {
    id: "3",
    collegeId: "2",
    userId: "3",
    userName: "Emily Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "The innovation labs are world-class. Perfect place for anyone interested in cutting-edge technology.",
    date: "2024-12-12",
  },
]


const dummyUsers = [
  {
    "id": "1765794729775",
    "name": "Abdullah Al Mujtahid0",
    "email": "asifaowadud@gmail.com",
    "password": "7894561213",
    "avatar": "/placeholder.svg?height=100&width=100&query=user+avatar",
    "phone": "00.00"
  }
]
