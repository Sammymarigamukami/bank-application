"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { Loader2, PieChart } from "lucide-react"
import { getCustomerAnalytics, useAuthRedirect, type AnalyticItem } from "~/api/auth"

export function AnalyticsCards() {
  // 1. Get current authenticated user
  const customer = useAuthRedirect();
  
  const [analytics, setAnalytics] = useState<AnalyticItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer?.id) return;

    const fetchAnalytics = async () => {
      try {
        const data = await getCustomerAnalytics(customer.id);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [customer?.id]);

  // Calculate total spending from the data
  const total = analytics.reduce((sum, item) => sum + Number(item.amount), 0);

  if (loading && !analytics.length) {
    return (
      <Card className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2 border-b mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Spending Analytics
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {analytics.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground italic">
            No transaction data found for this period.
          </div>
        ) : (
          analytics.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{item.category}</span>
                <span className="font-mono text-muted-foreground">
                  Ksh {Number(item.amount).toLocaleString()}
                </span>
              </div>
              {/* Progress bar uses the percentage from your API */}
              <Progress value={item.percentage} className="h-2 bg-secondary" />
              <p className="text-[10px] text-right text-muted-foreground font-medium">
                {item.percentage}% of total
              </p>
            </div>
          ))
        )}

        <div className="flex items-center justify-between border-t border-dashed pt-4 mt-6">
          <span className="text-sm font-bold text-muted-foreground uppercase">Total Outflow</span>
          <span className="text-xl font-black text-primary">
            Ksh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}