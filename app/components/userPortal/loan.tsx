'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Card } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

// Logic & API Imports
import {
  loanFormSchema,
  type LoanFormData,
  getInterestRate,
  calculateMonthlyPayment,
  calculateTotalInterest,
} from '~/lib/loan-validation'
import { applyForOnlineLoan } from '~/api/auth'
import UserLoansList from './dashboard/_components/loanList'



export default function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{
    idDocument?: File
    bankStatements?: File
  }>({})

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loanAmount: 50000,
      repaymentTerm: 12,
      employmentType: 'full-time',
      monthlyIncome: 50000,
      loanPurpose: 'personal',
    },
    mode: 'onChange',
  })

  const { watch } = form
  const loanAmount = watch('loanAmount')
  const repaymentTerm = watch('repaymentTerm')
  const employmentType = watch('employmentType')
  const monthlyIncome = watch('monthlyIncome')

  // Calculate loan metrics
  const interestRate = getInterestRate(employmentType)
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, repaymentTerm)
  const totalInterest = calculateTotalInterest(monthlyPayment, repaymentTerm, loanAmount)
  const totalAmount = loanAmount + totalInterest

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return form.trigger(['loanAmount', 'repaymentTerm'])
      case 2:
        return form.trigger(['employmentType', 'monthlyIncome', 'loanPurpose'])
      case 3:
        if (!uploadedFiles.idDocument || !uploadedFiles.bankStatements) {
          toast.error("Please upload both required documents before submitting.")
          return false
        }
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleFileUpload = useCallback(
    (event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>, field: 'idDocument' | 'bankStatements') => {
      event.preventDefault()
      let files: FileList | null = null
      
      if ('dataTransfer' in event) {
        files = event.dataTransfer.files
      } else if ('target' in event) {
        files = event.currentTarget.files
      }

      if (files && files.length > 0) {
        const file = files[0]
        setUploadedFiles((prev) => ({ ...prev, [field]: file }))
        // If your Zod schema includes these fields, set them here
        form.setValue(field as any, file) 
      }
    },
    [form]
  )

  const onSubmit = async (values: LoanFormData) => {
    // Final check for files
    if (!uploadedFiles.idDocument || !uploadedFiles.bankStatements) {
      toast.error("Required documents are missing.")
      return
    }

    setIsSubmitting(true)
    try {
      // Mapping local form state to the API interface
      const payload = {
        loanTypeId: 1, // You can map this based on values.loanPurpose
        amount: values.loanAmount,
        duration: values.repaymentTerm,
        interestRate: interestRate * 100, // Sending as 12.5 instead of 0.125
        purpose: values.loanPurpose,
        employmentStatus: values.employmentType,
        monthlyIncome: values.monthlyIncome,
        idDocument: uploadedFiles.idDocument,
        bankStatement: uploadedFiles.bankStatements,
      }

      const response = await applyForOnlineLoan(payload)

      if (response.success) {
        setIsCompleted(true)
        toast.success("Application submitted successfully!")
        
        // Reset after a delay
        setTimeout(() => {
          setIsCompleted(false)
          setCurrentStep(1)
          form.reset()
          setUploadedFiles({})
        }, 6000)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Loan Application
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Secure, fast, and transparent. Complete the three steps below to initiate your loan request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full"
                >
                  <Card className="flex flex-col items-center justify-center p-12 text-center h-full">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Your application is being processed. We will notify you via email and SMS within 24 hours regarding the status of your request.
                    </p>
                    <Button variant="outline" onClick={() => setIsCompleted(false)}>
                      View My Dashboard
                    </Button>
                  </Card>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* STEP 1: FINANCE */}
                    {currentStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-8">
                          <h2 className="text-2xl font-bold mb-6">Step 1: Loan Requirements</h2>
                          <div className="space-y-8">
                            <FormField
                              control={form.control}
                              name="loanAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex justify-between">
                                    <span>Requested Amount</span>
                                    <span className="font-bold text-emerald-600">Ksh {field.value.toLocaleString()}</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(Number(e.target.value))} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="repaymentTerm"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration (Months)</FormLabel>
                                  <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value.toString()}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select term" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {[12, 24, 36, 48, 60].map(m => (
                                        <SelectItem key={m} value={m.toString()}>{m} Months</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* STEP 2: PROFILE */}
                    {currentStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-8">
                          <h2 className="text-2xl font-bold mb-6">Step 2: Financial Profile</h2>
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="employmentType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="full-time">Full-time</SelectItem>
                                      <SelectItem value="self-employed">Self-employed</SelectItem>
                                      <SelectItem value="contract">Contract</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="monthlyIncome"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Monthly Net Income (Ksh)</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="loanPurpose"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Purpose of Loan</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="business">Business Growth</SelectItem>
                                      <SelectItem value="education">Education</SelectItem>
                                      <SelectItem value="emergency">Emergency</SelectItem>
                                      <SelectItem value="personal">Personal Project</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* STEP 3: DOCUMENTS */}
                    {currentStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="p-8">
                          <h2 className="text-2xl font-bold mb-6">Step 3: Document Verification</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ID Upload */}
                            <div className="space-y-2">
                              <FormLabel>National ID / Passport</FormLabel>
                              <div 
                                onClick={() => document.getElementById('id-upload')?.click()}
                                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-all"
                              >
                                <Input id="id-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'idDocument')} />
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm font-medium">{uploadedFiles.idDocument?.name || "Click to upload ID"}</p>
                              </div>
                            </div>
                            {/* Bank Statement */}
                            <div className="space-y-2">
                              <FormLabel>Latest Bank Statement</FormLabel>
                              <div 
                                onClick={() => document.getElementById('bank-upload')?.click()}
                                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-all"
                              >
                                <Input id="bank-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'bankStatements')} />
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm font-medium">{uploadedFiles.bankStatements?.name || "Click to upload Statement"}</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {/* Footer Nav */}
                    <div className="flex justify-between items-center pt-4">
                      <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      
                      {currentStep < 3 ? (
                        <Button type="button" onClick={handleNext} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                          Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]">
                          {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                          ) : (
                            <>Submit Application <CheckCircle className="ml-2 h-4 w-4" /></>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              )}
            </AnimatePresence>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6 bg-slate-900 text-white">
              <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2">Repayment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Interest Rate</span>
                  <span className="font-medium">{(interestRate * 100).toFixed(1)}% p.a</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Interest</span>
                  <span className="font-medium text-emerald-400">Ksh {totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-y border-slate-700">
                  <span className="text-slate-400">Monthly Installment</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Ksh {monthlyPayment.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">for {repaymentTerm} months</div>
                  </div>
                </div>
                <div className="pt-4 flex justify-between font-bold text-lg">
                  <span>Total Repayable</span>
                  <span>Ksh {totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-slate-800 rounded-lg text-xs text-slate-400 italic">
                * Rates are indicative and subject to final credit approval.
              </div>
            </Card>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
        <UserLoansList />
      </div>
      </div>
    </div>
  )
}