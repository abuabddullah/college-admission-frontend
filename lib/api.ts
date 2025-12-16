NEXT_PUBLIC_API_URL// API Service Layer for Backend Integration
const API_URL = "https://college-admission-five.vercel.app";

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "An error occurred" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
};

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==================== AUTH API ====================

export const authAPI = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  async updateProfile(data: {
    name?: string;
    phone?: string;
    address?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ==================== COLLEGE API ====================

export const collegeAPI = {
  async getAll(params?: {
    search?: string;
    type?: string;
    minRating?: number;
    sortBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.minRating)
      queryParams.append("minRating", params.minRating.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const response = await fetch(`${API_URL}/api/colleges?${queryParams}`);
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/colleges/${id}`);
    return handleResponse(response);
  },

  async create(data: any) {
    const response = await fetch(`${API_URL}/api/colleges`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/colleges/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/colleges/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
};

// ==================== BOOKING API ====================

export const bookingAPI = {
  async getAll() {
    const response = await fetch(`${API_URL}/api/bookings`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/api/bookings/${id}`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  async create(data: {
    collegeId: string;
    studentName: string;
    email: string;
    phone: string;
    course: string;
    previousEducation: string;
    grade: string;
    address: string;
    guardianName?: string;
    guardianPhone?: string;
  }) {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
};

// ==================== REVIEW API ====================

export const reviewAPI = {
  async getByCollege(collegeId: string) {
    const response = await fetch(`${API_URL}/api/reviews/college/${collegeId}`);
    return handleResponse(response);
  },

  async getByUser() {
    const response = await fetch(`${API_URL}/api/reviews/user`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  async create(data: { collegeId: string; rating: number; comment: string }) {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async update(id: string, data: { rating?: number; comment?: string }) {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
};
