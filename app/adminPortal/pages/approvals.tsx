import { getTransferApprovals } from "~/lib/adminMockData"
import { AdminLayout } from "../_components/layouts/adminLayout"
import { ApprovalCard } from "../_components/approvalCard"


export const metadata = {
  title: 'Approvals | NexusBank Admin',
  description: 'Transfer approval management',
}

export default function ApprovalsPage() {
  const approvals = getTransferApprovals()
  const pendingApprovals = approvals.filter((a) => a.status === 'pending')
  const completedApprovals = approvals.filter((a) => a.status !== 'pending')

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transfer Approvals</h1>
          <p className="text-slate-600 mt-2">Review and manage pending transfer approvals</p>
        </div>

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Pending ({pendingApprovals.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Approvals */}
        {completedApprovals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Completed ({completedApprovals.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
