import { z } from "zod";

const registerSchema = z.object({
  name: z.string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must be at most 20 characters" })
    .trim()
    .toLowerCase(),
  email: z.string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must be at most 20 characters" })
    .trim(),
  bloodType: z.string({ required_error: "Blood Type is required" })
    .min(1, { message: "Blood Type is required" })
    .max(10, { message: "Blood Type must be at most 10 characters" })
    .trim()
    .toLowerCase(),
  city: z.string({ required_error: "City is required" })
    .min(3, { message: "City must be at least 3 characters" })
    .max(20, { message: "City must be at most 20 characters" })
    .trim()
    .toLowerCase(),
  contactInfo: z.string({ required_error: "Contact Info is required" })
    .min(10, { message: "Contact Info must be at least 10 characters" })
    .max(12, { message: "Contact Info must be at most 12 characters" })
    .trim()
    .toLowerCase(),
  role: z.enum(["Donor", "Patient"], { required_error: "Role is required" }),
});

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must be at most 20 characters" })
    .trim(),
});

export { registerSchema, loginSchema };
