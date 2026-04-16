'use client'

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { getAccountAnalysis, useAuthRedirect, type AnalysisResponse } from "~/api/auth"
import { toast } from "sonner"

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const customer = useAuthRedirect();

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Ensure we have a customer ID before fetching
      if (!customer?.id) return;

      try {
        setLoading(true)
        const result = await getAccountAnalysis(customer.id)
        setData(result)
      } catch (err: any) {
        toast.error(err.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [customer?.id])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data) return null

  const totalSpending = data.spendingByCategory.reduce((sum, item) => sum + item.amount, 0)

  // Find the highest value in monthly overview to scale the bars correctly
  const maxVal = Math.max(
    ...data.monthlyOverview.flatMap(m => [Number(m.income), Number(m.expenses)]),
    1000 // Fallback minimum scale
  );

  const summaryCards = [
    {
      title: "Total Income",
      value: `Ksh ${data.summary.totalIncome.toLocaleString()}`,
      change: "null", 
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Expenses",
      value: `Ksh ${data.summary.totalExpenses.toLocaleString()}`,
      change: "null",
      trend: "down",
      icon: TrendingDown,
    },
    {
      title: "Savings Rate",
      value: `${data.summary.savingsRate}%`,
      change: "null",
      trend: Number(data.summary.savingsRate) > 0 ? "up" : "down",
      icon: PiggyBank,
    },
    {
      title: "Net Worth",
      value: `Ksh ${data.summary.netWorth.toLocaleString()}`,
      change: "null",
      trend: data.summary.netWorth > 0 ? "up" : "down",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Track your spending patterns and financial insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`mt-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.spendingByCategory.map((item, i) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">Ksh {item.amount.toLocaleString()}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" style={{ "--tw-progress-color": `hsl(var(--chart-${(i % 5) + 1}))` } as React.CSSProperties} />
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">Ksh {totalSpending.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.monthlyOverview.map((month) => {
              const incomeNum = Number(month.income)
              const expensesNum = Number(month.expenses)
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month.month} 2026</span>
                    <span className="text-muted-foreground">Net: Ksh {(incomeNum - expensesNum).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-green-600">Income</span>
                        <span>Ksh {incomeNum.toLocaleString()}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-green-100">
                        <div className="h-full bg-green-500 transition-all" style={{ width: `${(incomeNum / maxVal) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-red-600">Expenses</span>
                        <span>Ksh {expensesNum.toLocaleString()}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-red-100">
                        <div className="h-full bg-red-500 transition-all" style={{ width: `${(expensesNum / maxVal) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.budgetGoals.map((item, i) => {
              const percentage = Math.min((item.spent / item.budget) * 100, 100)
              const isOver = item.spent > item.budget
              return (
                <div key={`${item.category}-${i}`} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium capitalize">{item.category}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-xl font-bold ${isOver ? "text-red-600" : ""}`}>Ksh {item.spent.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ Ksh {item.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={percentage} className={`mt-2 h-2 ${isOver ? "[&>div]:bg-red-500" : ""}`} />
                  <p className={`mt-1 text-xs ${isOver ? "text-red-600" : "text-muted-foreground"}`}>
                    {isOver ? `Ksh ${(item.spent - item.budget).toLocaleString()} over budget` : `Ksh ${(item.budget - item.spent).toLocaleString()} remaining`}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}