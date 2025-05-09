
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useThemeStore, applyThemeColor } from "@/lib/theme";
import { filterDataByYear, getYearOptions, hasData } from "@/lib/data-utils";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [utilityType, setUtilityType] = useState("electricity");
  const [chartView, setChartView] = useState("usage");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasReadings, setHasReadings] = useState(true); // Simulate having readings
  const { getColor } = useThemeStore();
  const navigate = useNavigate();
  
  const yearOptions = getYearOptions();

  // Apply theme on component mount
  useEffect(() => {
    applyThemeColor(getColor('default'));
    
    // Check if we have readings data (simulated)
    // In a real app, you'd fetch this from your API or database
    setHasReadings(true); // simulate having data
  }, [getColor]);

  // Mock data for electricity usage
  const electricityData = hasReadings ? [
    { month: "Jan", usage: 95, cost: 68.4, reading: "1250 kWh" },
    { month: "Feb", usage: 85, cost: 61.2, reading: "1335 kWh" },
    { month: "Mar", usage: 78, cost: 56.16, reading: "1413 kWh" },
    { month: "Apr", usage: 90, cost: 64.8, reading: "1503 kWh" },
    { month: "May", usage: 102, cost: 73.44, reading: "1605 kWh" },
    { month: "Jun", usage: 110, cost: 79.2, reading: "1715 kWh" },
  ] : [];

  // Mock data for water usage
  const waterData = hasReadings ? [
    { month: "Jan", usage: 52, cost: 34.84, reading: "320 m³" },
    { month: "Feb", usage: 48, cost: 32.16, reading: "368 m³" },
    { month: "Mar", usage: 50, cost: 33.5, reading: "418 m³" },
    { month: "Apr", usage: 55, cost: 36.85, reading: "473 m³" },
    { month: "May", usage: 60, cost: 40.2, reading: "533 m³" },
    { month: "Jun", usage: 63, cost: 42.21, reading: "596 m³" },
  ] : [];

  // Mock data for gas usage
  const gasData = hasReadings ? [
    { month: "Jan", usage: 78, cost: 72.54, reading: "450 m³" },
    { month: "Feb", usage: 82, cost: 76.26, reading: "532 m³" },
    { month: "Mar", usage: 75, cost: 69.75, reading: "607 m³" },
    { month: "Apr", usage: 68, cost: 63.24, reading: "675 m³" },
    { month: "May", usage: 65, cost: 60.45, reading: "740 m³" },
    { month: "Jun", usage: 60, cost: 55.8, reading: "800 m³" },
  ] : [];

  // Mock data for internet usage
  const internetData = hasReadings ? [
    { month: "Jan", usage: 50, cost: 45, reading: "50 GB" },
    { month: "Feb", usage: 50, cost: 45, reading: "50 GB" },
    { month: "Mar", usage: 50, cost: 45, reading: "50 GB" },
    { month: "Apr", usage: 50, cost: 45, reading: "50 GB" },
    { month: "May", usage: 50, cost: 45, reading: "50 GB" },
    { month: "Jun", usage: 50, cost: 45, reading: "50 GB" },
  ] : [];

  // Mock data for overall utility breakdown
  const utilityBreakdown = hasReadings ? [
    { name: "Electricity", value: 403.2 },
    { name: "Water", value: 219.76 },
    { name: "Gas", value: 398.04 },
    { name: "Internet", value: 270 },
  ] : [];

  // Determine which data set to use based on utility type
  const getUtilityData = () => {
    switch (utilityType) {
      case "electricity":
        return electricityData;
      case "water":
        return waterData;
      case "gas":
        return gasData;
      case "internet":
        return internetData;
      default:
        return electricityData;
    }
  };

  // Get utility color based on type or theme
  const getUtilityColor = () => {
    switch (utilityType) {
      case "electricity":
        return getColor("electricity") || "#3b82f6";
      case "water":
        return getColor("water") || "#0ea5e9";
      case "gas":
        return getColor("gas") || "#ef4444";
      case "internet":
        return getColor("internet") || "#8b5cf6";
      default:
        return getColor("default") || "#3b82f6";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize and analyze your utility consumption patterns
          </p>
        </div>
        <Select 
          value={selectedYear.toString()} 
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasReadings ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Utility Analysis</CardTitle>
                  <CardDescription>
                    {chartView === "usage" ? "Monthly usage" : "Monthly cost"} for {selectedYear}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={utilityType} onValueChange={setUtilityType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Select utility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tabs value={chartView} onValueChange={setChartView}>
                    <TabsList>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                      <TabsTrigger value="cost">Cost</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getUtilityData()}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border p-3 rounded-md shadow-lg">
                            <p className="font-medium">{data.month}</p>
                            <p className="text-sm">Reading: {data.reading}</p>
                            <p className="text-sm">{chartView === "usage" ? `Usage: ${data.usage}` : `Cost: $${data.cost}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Bar
                      dataKey={chartView === "usage" ? "usage" : "cost"}
                      name={chartView === "usage" ? "Usage" : "Cost"}
                      fill={getUtilityColor()}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                Total expenditure by utility for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={utilityBreakdown}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Cost ($)"
                      stroke={getColor("default") || "#10b981"}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">Total cost by utility:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor("electricity") || "#3b82f6" }}></span>
                    <span className="text-sm">Electricity: $403.20</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor("water") || "#0ea5e9" }}></span>
                    <span className="text-sm">Water: $219.76</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor("gas") || "#ef4444" }}></span>
                    <span className="text-sm">Gas: $398.04</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor("internet") || "#8b5cf6" }}></span>
                    <span className="text-sm">Internet: $270.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Analytics Data</CardTitle>
            <CardDescription>
              Add readings to view analytics and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-4">
                There is no data to analyze. Add readings to start tracking your utility usage and costs.
              </p>
              <Button 
                onClick={() => navigate("/add-reading")}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Reading</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
