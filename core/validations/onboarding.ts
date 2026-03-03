import { z } from "zod";

const phoneRegex = /^\+[1-9]\d{1,14}$/;

export const introductionSchema = z.object({
    agentName: z.string().min(1, "Please choose a biographer"),
    isGift: z.boolean().default(false),
});

export const personalIdentitySchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    preferredName: z.string().max(50).optional().default(""),
});

export const anchorPointsSchema = z.object({
    dateOfBirth: z.string().min(1, "Please select your date of birth"),
    birthplace: z.string().min(2, "Please enter your birthplace"),
});

export const lifeRoadmapSchema = z.object({
    lifeChapters: z
        .array(z.number().min(1).max(8))
        .min(1, "Select at least one chapter")
        .max(3, "Select up to 3 chapters"),
});

export const conversationalVibeSchema = z.object({
    conversationalVibe: z.enum(["reflective", "casual", "direct"], {
        message: "Please choose a conversational style",
    }),
});

export const logisticsSchema = z.object({
    phone: z
        .string()
        .regex(phoneRegex, "Please enter a valid phone number (e.g., +15550001234)"),
    preferredTimezone: z.string().min(1, "Please select your timezone"),
    preferredDay: z.string().min(1, "Please select a day"),
    preferredTime: z.string().min(1, "Please select a time"),
});

export const onboardingSchema = introductionSchema
    .merge(personalIdentitySchema)
    .merge(anchorPointsSchema)
    .merge(lifeRoadmapSchema)
    .merge(conversationalVibeSchema)
    .merge(logisticsSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

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
