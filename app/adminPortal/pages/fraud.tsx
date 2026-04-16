import { getDashboardStats, getFraudAlerts } from "~/lib/adminMockData"
import { AdminLayout } from "../_components/layouts/adminLayout"
import { FraudDashboard } from "../_components/fraud/fraudDashboard"
import { FraudAlertCard } from "../_components/fraud/fraudAlertCard"
import { Card } from "~/components/ui/card"


export const metadata = {
  title: 'Fraud Detection | NexusBank Admin',
  description: 'Fraud detection and suspicious activity monitoring',
}

export default function FraudPage() {
  const alerts = getFraudAlerts()
  const stats = getDashboardStats()
  const highRiskAlerts = alerts.filter((a) => a.riskLevel === 'high')
  const mediumRiskAlerts = alerts.filter((a) => a.riskLevel === 'medium')

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Fraud Detection</h1>
          <p className="text-slate-600 mt-2">Monitor suspicious activities and fraud alerts</p>
        </div>

        {/* Dashboard Stats */}
        <FraudDashboard
          highRiskCount={highRiskAlerts.length || 0}
          flaggedAccounts={alerts.length}
          blockedTransfers={0}
        />

        {/* High Risk Alerts */}
        {highRiskAlerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              High Risk Alerts ({highRiskAlerts.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {highRiskAlerts.map((alert) => (
                <FraudAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Medium Risk Alerts */}
        {mediumRiskAlerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Medium Risk Alerts ({mediumRiskAlerts.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mediumRiskAlerts.map((alert) => (
                <FraudAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* All Alerts */}
        {alerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">All Alerts</h2>
            <Card className="p-6">
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border-b border-slate-200 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{alert.customerName}</p>
                      <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{alert.date}</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                        alert.riskLevel === 'high'
                          ? 'bg-red-100 text-red-700'
                          : alert.riskLevel === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
  )
}
