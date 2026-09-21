import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const educationSchema = z.object({
  schoolName: optionalText(200),
  educationType: optionalText(100),
  enrollmentDate: optionalText(20),
  graduationDate: optionalText(20),

  graduationStatus: z.enum([
    "",
    "graduated",
    "expectedGraduation",
    "currentlyEnrolled",
    "withdrawn",
  ]),

  major: optionalText(200),
});

const qualificationSchema = z.object({
  name: optionalText(200),
  levelOrScore: optionalText(100),
  acquiredDate: optionalText(20),
  expiryDate: optionalText(20),
  issuer: optionalText(200),
  note: optionalText(1000),
});

const employmentSchema = z.object({
  companyName: optionalText(200),
  employmentType: optionalText(100),
  department: optionalText(200),
  jobTitle: optionalText(200),
  workLocation: optionalText(200),

  startDate: optionalText(20),
  endDate: optionalText(20),

  isCurrent: z.boolean(),

  responsibilities: optionalText(3000),
  achievements: optionalText(3000),
});

export const clientFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(200),

  furigana: optionalText(200),

  phone: z.string().trim().min(1, "Phone number is required.").max(50),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .optional()
    .or(z.literal("")),

  dateOfBirth: optionalText(20),
  gender: optionalText(50),
  nationality: optionalText(100),

  postalCode: optionalText(30),
  prefecture: optionalText(100),
  address: optionalText(500),

  currentVisaStatus: z
    .string()
    .trim()
    .min(1, "Current visa status is required."),

  residenceExpiryDate: optionalText(20),

  passportNumber: optionalText(100),
  passportExpiryDate: optionalText(20),

  preferCategory: z.string().trim().min(1, "Preferred category is required."),

  assignedStaff: optionalText(100),
  intake: optionalText(100),

  education: z.array(educationSchema),

  japaneseLanguageLevel: optionalText(100),

  qualifications: z.array(qualificationSchema),

  skillsText: optionalText(3000),

  employmentHistory: z.array(employmentSchema),

  careerSummary: optionalText(5000),

  motivation: optionalText(3000),
  selfPR: optionalText(3000),
  desiredConditions: optionalText(2000),

  // Registration payment - create only
  paymentMethod: z.union([
    z.literal(""),
    z.literal("Bank Transfer"),
    z.literal("Cash"),
  ]),

  paymentDate: optionalText(20),
  bankName: optionalText(200),
  referenceNumber: optionalText(200),
  receiptNumber: optionalText(200),
  paymentNote: optionalText(1000),

  clientImage: z.any().optional(),
  cv: z.any().optional(),
});
