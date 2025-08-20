export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type Gender = "Male" | "Female" | "Other";

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
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

