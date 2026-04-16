import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { getCustomerTransactions, useAuthRedirect, type Transaction } from "~/api/auth";
import { useState, useEffect } from "react";
import { Link } from "react-router";

export function TransactionTable({ className }: { className?: string }) {
  const user = useAuthRedirect();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getCustomerTransactions(user.id); // fetch last 5 transactions
      setTransactions(data.slice(0, 5));
      console.log("Fetched transactions:", data);
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Transactions
        </CardTitle>
        <Link
          to="/customerPortal/transactions"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="px-0">
        {/* Conditional rendering inside the card */}
        {!user || loading ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No transactions to display
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            You have no recent transactions
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-6 text-right hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, idx) => (
                <TableRow key={idx}>
                  <TableCell className="pl-6 text-muted-foreground">
                    {new Date(transaction.date).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.description || "-"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      parseFloat(transaction.amount) > 0 ? "text-green-600" : "text-foreground"
                    )}
                  >
                    {parseFloat(transaction.amount) > 0 ? "+" : ""}
                    Ksh{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                  </TableCell>
                  <TableCell className="pr-6 text-right hidden md:table-cell">
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className={cn(
                        "font-normal",
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      )}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}