
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtilityChart } from "@/components/UtilityChart";
import { RecentReadingsTable } from "@/components/RecentReadingsTable";

interface DashboardChartsProps {
  monthlyData: any[];
  selectedYear: number;
}

export function DashboardCharts({ monthlyData, selectedYear }: DashboardChartsProps) {
  if (!monthlyData || monthlyData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Consumption Trends</CardTitle>
          <CardDescription>
            Monthly utility consumption for {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UtilityChart data={monthlyData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>
            Your latest submitted utility readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentReadingsTable />
        </CardContent>
      </Card>
    </div>
  );
}
