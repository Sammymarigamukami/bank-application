"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { FieldGroup, Field, FieldLabel } from "../ui/field"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { accounts } from "~/lib/mock-data"
import { NOMEM } from "dns"

export default function TransferPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Transfer Money</h1>
        <p className="text-muted-foreground">
          Send money to other accounts quickly and securely.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Transfer</CardTitle>
            <CardDescription>
              Fill in the details to transfer money.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Transfer Initiated!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your transfer is being processed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="from-account">From Account</FieldLabel>
                    <Select defaultValue="1">
                      <SelectTrigger id="from-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.number}) - Ksh
                            {account.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="recipient-name">Recipient Name</FieldLabel>
                    <Input
                      id="recipient-name"
                      placeholder="Enter recipient's full name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="recipient-account">Recipient Account</FieldLabel>
                    <Input
                      id="recipient-account"
                      placeholder="Enter account number"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="amount">Amount</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        Ksh
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-9"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="note">Note (Optional)</FieldLabel>
                    <Textarea
                      id="note"
                      placeholder="Add a note for this transfer"
                      rows={3}
                    />
                  </Field>
                </FieldGroup>

                <Button type="submit" className="mt-6 w-full">
                  Send Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transfer Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Limit</span>
                <span className="font-medium">Ksh10,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly Limit</span>
                <span className="font-medium">Ksh50,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remaining Today</span>
                <span className="font-medium text-green-600">Ksh10,000</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["sam"].map((name, i) => (
                <div
                  key={i}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}