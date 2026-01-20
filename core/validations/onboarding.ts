import { z } from "zod";

// Phone number validation (E.164 format)
const phoneRegex = /^\+[1-9]\d{1,14}$/;

// Personal Info Schema (email comes from auth, not onboarding)
export const personalInfoSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    phone: z
        .string()
        .regex(phoneRegex, "Please enter a valid phone number (e.g., +15550001234)"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;