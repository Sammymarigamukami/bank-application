import { Download, FileText, BarChart3, PieChart } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { toast } from "sonner"
import { useState } from 'react'
import { downloadAccountsReport, downloadDailyAdminReport, downloadTransactionReport } from '~/api/auth'

export const metadata = {
  title: 'Reports | NexusBank Admin',
  description: 'Generate and download reports',
}

export default function ReportsPage() {
  // 1. Hook for auth (as requested)
  // const customer = useAuthRedirect(); 

  // 2. State for the Custom Generator
  const [customType, setCustomType] = useState('Transactions')
  const [customPeriod, setCustomPeriod] = useState('today')
  const [customFormat, setCustomFormat] = useState('csv')

  // Helper to trigger browser download
  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Main download handler for the grid cards
  const handleCardDownload = async (title: string, format: string) => {
    if (title === 'Fraud Analysis Report') {
      toast.info("Fraud reports logic coming soon...");
      return;
    }

    const tId = toast.loading(`Generating ${title}...`);
    try {
      let blob: Blob;
      const lowerFormat = format.toLowerCase() as 'csv' | 'pdf' | 'excel';

      if (title === 'Daily Transactions Report') {
        const today = new Date().toISOString().split('T')[0];
        blob = await downloadDailyAdminReport(today, lowerFormat);
      } else if (title === 'Monthly Summary Report') {
        blob = await downloadTransactionReport({ period: 'month', format: lowerFormat });
      } else if (title === 'Customer Activity Report') {
        blob = await downloadAccountsReport(lowerFormat);
      } else {
        throw new Error("Unknown report type");
      }

      triggerDownload(blob, `${title.replace(/\s+/g, '_')}.${lowerFormat}`);
      toast.success(`${title} downloaded`, { id: tId });
    } catch (error: any) {
      toast.error(error.message || "Failed to download", { id: tId });
    }
  };

  const handleCustomGenerate = async () => {
    const tId = toast.loading("Generating custom report...");
    try {
      let blob: Blob;
      const format = customFormat.toLowerCase() as 'csv' | 'pdf' | 'excel';

      if (customType === 'Transactions') {
        blob = await downloadTransactionReport({ 
          period: customPeriod.toLowerCase() as any, 
          format 
        });
      } else if (customType === 'Accounts' || customType === 'Customers') {
        blob = await downloadAccountsReport(format);
      } else {
        toast.info("This custom type logic is not wired yet.");
        toast.dismiss(tId);
        return;
      }

      triggerDownload(blob, `Custom_${customType}_Report.${format}`);
      toast.success("Report generated", { id: tId });
    } catch (error: any) {
      toast.error("Generation failed", { id: tId });
    }
  };

  const reports = [
    {
      title: 'Daily Transactions Report',
      description: 'Complete list of all transactions for the selected day',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      formats: ['CSV', 'PDF'],
    },
    {
      title: 'Monthly Summary Report',
      description: 'Monthly summary of transactions, accounts, and customer activity',
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      formats: ['CSV', 'PDF'],
    },
    {
      title: 'Customer Activity Report',
      description: 'Individual customer activity and account details',
      icon: <PieChart className="w-8 h-8 text-purple-600" />,
      formats: ['CSV', 'PDF'],
    },
    {
      title: 'Fraud Analysis Report',
      description: 'Detailed analysis of fraud alerts and suspicious activities',
      icon: <BarChart3 className="w-8 h-8 text-red-600" />,
      formats: ['CSV', 'PDF'],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-2">Generate and download various reports</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">{report.icon}</div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{report.title}</h3>
            <p className="text-slate-600 text-sm mb-6">{report.description}</p>
            <div className="flex gap-3">
              {report.formats.map((format) => (
                <Button 
                  key={format} 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 flex-1"
                  onClick={() => handleCardDownload(report.title, format)}
                >
                  <Download className="w-4 h-4" />
                  {format}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Custom Report Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Report Type</label>
            <select 
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Transactions</option>
              <option>Customers</option>
              <option>Accounts</option>
              <option>Fraud Alerts</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Date Range</label>
            <select 
              value={customPeriod}
              onChange={(e) => setCustomPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Format</label>
            <select 
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <Button className="gap-2" onClick={handleCustomGenerate}>
            <Download className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </Card>
    </div>
  )
}