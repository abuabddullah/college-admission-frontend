// Application constants and configuration

export const APP_NAME = "CollegeHub";
export const APP_DESCRIPTION = "Discover top colleges and book your admission";

// API Configuration
export const API_URL = "https://college-admission-five.vercel.app";

// Pagination
export const ITEMS_PER_PAGE = 12;

// Status colors mapping
export const STATUS_COLORS = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
} as const;

// Demo credentials
export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "password",
};

// College types
export const COLLEGE_TYPES = [
  "University",
  "College",
  "Institute",
  "Academy",
] as const;

// Booking status types
export const BOOKING_STATUS = ["pending", "approved", "rejected"] as const;

// Rating range
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Form validation
export const PASSWORD_MIN_LENGTH = 6;
export const PHONE_REGEX = /^[+]?[\d\s\-()]+$/;
