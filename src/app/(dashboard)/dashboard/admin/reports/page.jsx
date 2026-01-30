// ===== src/app/(dashboard)/dashboard/admin/reports/page.jsx =====
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AdminReports() {
  const reportTypes = [
    {
      title: 'Student Performance Report',
      description: 'Academic performance analysis by class and subject',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Attendance Report',
      description: 'Student attendance statistics and trends',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Financial Report',
      description: 'Payment collection and outstanding fees',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Teacher Performance',
      description: 'Teaching staff activity and student feedback',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and view reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Custom report builder coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
