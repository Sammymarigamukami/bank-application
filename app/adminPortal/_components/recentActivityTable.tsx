import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Check, X } from 'lucide-react'
import type { SystemActivity } from '~/lib/type'

interface RecentActivityTableProps {
  activities: SystemActivity[]
}

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  const recentActivities = activities.slice(0, 6)

  return (
    <Card>
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="text-slate-600 font-semibold">Date</TableHead>
            <TableHead className="text-slate-600 font-semibold">User</TableHead>
            <TableHead className="text-slate-600 font-semibold">Action</TableHead>
            <TableHead className="text-slate-600 font-semibold">Account</TableHead>
            <TableHead className="text-slate-600 font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActivities.map((activity) => (
            <TableRow key={activity.id} className="border-b border-slate-100 hover:bg-slate-50">
              <TableCell className="text-slate-900 text-sm">{activity.date}</TableCell>
              <TableCell className="text-slate-600 text-sm">{activity.user}</TableCell>
              <TableCell className="text-slate-900 text-sm font-medium">{activity.action}</TableCell>
              <TableCell className="text-slate-600 text-sm">{activity.account || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant={activity.status === 'success' ? 'default' : 'destructive'}
                  className="flex items-center gap-1 w-fit"
                >
                  {activity.status === 'success' ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  {activity.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
