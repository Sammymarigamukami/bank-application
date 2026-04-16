import { z } from 'zod'

export const loanFormSchema = z.object({
  // Step 1: Loan Amount & Repayment Term
  loanAmount: z.number()
    .min(1000, 'Loan amount must be at least $1,000')
    .max(1000000, 'Loan amount cannot exceed $1,000,000'),
  repaymentTerm: z.number()
    .min(12, 'Repayment term must be at least 12 months')
    .max(360, 'Repayment term cannot exceed 360 months'),

  // Step 2: Employment & Income Details
  employmentType: z.enum(['full-time', 'part-time', 'self-employed', 'retired'], {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
  monthlyIncome: z.number()
    .min(0, 'Monthly income must be a positive number')
    .refine((val) => val > 0, 'Monthly income is required'),
  loanPurpose: z.enum(['home', 'auto', 'education', 'personal', 'business'], {
    errorMap: () => ({ message: 'Please select a loan purpose' }),
  }),

  // Step 3: Document Upload
  idDocument: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'File must be PDF or image (JPEG/PNG)'
    ),
  bankStatements: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'File must be PDF or image (JPEG/PNG)'
    ),
})

export type LoanFormData = z.infer<typeof loanFormSchema>

// Interest rate calculation based on employment type
export const getInterestRate = (employmentType: string): number => {
  switch (employmentType) {
    case 'full-time':
      return 0.045 // 4.5%
    case 'part-time':
      return 0.065 // 6.5%
    case 'self-employed':
      return 0.085 // 8.5%
    case 'retired':
      return 0.055 // 5.5%
    default:
      return 0.06 // 6% default
  }
}

// Calculate monthly payment using simple interest formula
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 12
  if (monthlyRate === 0) return principal / months

  return (
    (principal * monthlyRate * (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1)
  )
}

// Calculate total interest
export const calculateTotalInterest = (
  monthlyPayment: number,
  months: number,
  principal: number
): number => {
  return monthlyPayment * months - principal
}
