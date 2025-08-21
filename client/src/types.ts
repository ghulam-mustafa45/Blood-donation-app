export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type Gender = "Male" | "Female" | "Other";

export type RequestStatus = 'Open' | 'In Progress' | 'Fulfilled' | 'Cancelled' | 'Expired'

export interface RequestAssignment {
  donorId: string;
  donorName: string;
  assignedAt: string; // ISO
}

export interface RequestNote {
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  bloodType?: BloodType;
  city: string;
  contactInfo?: string;
  token?: string;
}

export interface DonationRequest {
  _id: string;
  patientName: string;
  bloodType: BloodType;
  city: string;
  hospital?: string;
  details?: string;
  createdAt: string;
  requestedBy: string; // userId
  phone?: string;
  gender?: Gender;
  status?: RequestStatus;
  assignment?: RequestAssignment;
  etaAt?: string; // ISO
  notes?: RequestNote[];
  expiresAt?: string; // ISO
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

