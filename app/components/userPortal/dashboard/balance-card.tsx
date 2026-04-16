import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import { getAllCategorizedAccounts, useAuthRedirect, type Account, type CategorizedAccounts } from "~/api/auth";


export function BalanceCard({ className }: { className?: string }) {
  const user = useAuthRedirect();
  const [currentAccount, setCurrentAccount] = useState<CategorizedAccounts | null>(null);
  const [loading, setLoading] = useState(true);

  // Optional: monthly stats placeholder
  const [monthlyStats, setMonthlyStats] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      setLoading(true);
      const categorizedAccountsData = await getAllCategorizedAccounts(user.id);
      console.log("Fetched categorized accounts:", categorizedAccountsData);
      setCurrentAccount(categorizedAccountsData.accounts?.current?.[0] || null);
      setMonthlyStats({ income: 0, expenses: 0 }); // replace with real API later if needed
      setLoading(false);
    };

    fetchAccount();
  }, [user]);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Current Account Balance
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Conditional rendering inside the card */}
        {!user || loading ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Loading account data...
          </p>
        ) : !currentAccount ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No current account available
          </p>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                Ksh{currentAccount.balance}
              </span>
              <span className="text-sm text-muted-foreground">KSH</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Income this month</p>
                  <p className="text-sm font-semibold text-foreground">
                    +Ksh{monthlyStats.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expenses this month</p>
                  <p className="text-sm font-semibold text-foreground">
                    -Ksh{monthlyStats.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}