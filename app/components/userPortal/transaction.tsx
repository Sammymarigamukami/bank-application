import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Search, Download, Filter } from "lucide-react";
import { cn } from "~/lib/utils";
import { getCustomerTransactions, useAuthRedirect, type Transaction } from "~/api/auth";
import { useState, useEffect } from "react";

export default function TransactionsPage() {
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
      const data = await getCustomerTransactions(user.id);
      setTransactions(data);
      console.log("Fetched transactions:", data);
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View and search your transaction history.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">All Transactions</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          {/* Conditional rendering inside the card */}
          {!user || loading ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No transactions to display
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              You have no transactions yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="pr-6 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 text-muted-foreground">
                      {new Date(transaction.date).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.description || "-"}</TableCell>
                    <TableCell>
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
                    <TableCell className="pr-6 text-right">
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
    </div>
  );
}