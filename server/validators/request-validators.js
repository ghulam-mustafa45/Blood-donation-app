import { z } from "zod";

export const createRequestSchema = z.object({
  patientName: z.string().min(3),
  bloodType: z.string().min(1),
  city: z.string().min(2),
  hospital: z.string().optional(),
  details: z.string().optional(),
  phone: z.string().min(10).max(15).optional(),
  gender: z.enum(["Male","Female","Other"]).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const updateRequestSchema = z.object({
  patientName: z.string().min(3).optional(),
  bloodType: z.string().min(1).optional(),
  city: z.string().min(2).optional(),
  hospital: z.string().optional(),
  details: z.string().optional(),
  phone: z.string().min(10).max(15).optional(),
  gender: z.enum(["Male","Female","Other"]).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const statusSchema = z.object({ status: z.enum(["Open","In Progress","Fulfilled","Cancelled","Expired"]) });
export const assignSchema = z.object({ donorId: z.string().min(1) });
export const etaSchema = z.object({ etaAt: z.string().datetime() });
export const noteSchema = z.object({ message: z.string().min(1).max(1000) });


