import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { Plane, Car, Shield } from "lucide-react"
import { savingsGoals } from "~/lib/mock-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  car: Car,
  shield: Shield,
}

export function SavingsGoals() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Savings Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savingsGoals.map((goal) => {
          const Icon = iconMap[goal.icon] || Shield
          const percentage = Math.round((goal.saved / goal.target) * 100)

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="mt-1 h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ksh{goal.saved.toLocaleString()} / Ksh{goal.target.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
