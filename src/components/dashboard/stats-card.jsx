// File: src/components/dashboard/stats-card.jsx


// ==================== src/components/dashboard/stats-card.jsx ====================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatsCard({ title, value, icon: Icon, description, className }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}