// Type definitions for the application

export interface User {
  _id?: string
  id?: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  createdAt?: string
}

export interface College {
  _id?: string
  id?: string
  name: string
  location: string
  description: string
  rating: number
  image: string
  type: string
  established: number
  affiliations: string[]
  courses: string[]
  facilities: string[]
  tuitionFee: number
  gallery: string[]
  createdAt?: string
  reviews?: Review[]
}

export interface Booking {
  _id?: string
  id?: string
  userId: string
  collegeId: string | College
  studentName: string
  email: string
  phone: string
  course: string
  previousEducation: string
  grade: string
  address: string
  guardianName?: string
  guardianPhone?: string
  status: "pending" | "approved" | "rejected"
  createdAt?: string
}

export interface Review {
  _id?: string
  id?: string
  userId: string
  collegeId: string
  userName: string
  rating: number
  comment: string
  createdAt?: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface ApiError {
  error: string
}
