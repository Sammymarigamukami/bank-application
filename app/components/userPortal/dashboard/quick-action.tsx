"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Send, Download, Receipt, Landmark } from "lucide-react"
import { Link } from "react-router"
import { useDeposit } from "./context/depositContext"
import { useSendMoney } from "./context/sendMoneyContext"
import { usePaybill } from "./context/paybillContext"
import { useWithdrawal } from "./context/withdrawalContext"

export function QuickActions() {
  const {setShowSendFormModal } = useSendMoney()
  const { setShowWithdrawModal } = useWithdrawal();
  const { setShowDepositModal } = useDeposit();
  const { setShowFormModalPaybill } = usePaybill(); // For Pay Bills, we can reuse the request money form modal state
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">

          <Button
          onClick={() => setShowSendFormModal(true)}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="#">
              <Send className="h-5 w-5" />
              <span className="text-xs">Send Money</span>
            </Link>
          </Button>

          <Button
           onClick={() => setShowWithdrawModal(true)}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="#">
              <Download className="h-5 w-5" />
              <span className="text-xs">Withdraw Funds</span>
            </Link>
          </Button>

          <Button
            onClick={() => setShowFormModalPaybill(true)}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="#">
              <Receipt className="h-5 w-5" />
              <span className="text-xs">Pay Bills</span>
            </Link>
          </Button>

          <Button onClick={() => setShowDepositModal(true)}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="#">
              <Landmark className="h-5 w-5" />
              <span className="text-xs">Deposit</span>
            </Link>
          </Button>

        </div>
      </CardContent>
    </Card>
  )
}