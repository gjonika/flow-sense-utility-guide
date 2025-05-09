
import { useState } from "react";
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

// Mock data for electricity usage
const electricityData = [
  { month: "Jan", usage: 95, cost: 68.4 },
  { month: "Feb", usage: 85, cost: 61.2 },
  { month: "Mar", usage: 78, cost: 56.16 },
  { month: "Apr", usage: 90, cost: 64.8 },
  { month: "May", usage: 102, cost: 73.44 },
  { month: "Jun", usage: 110, cost: 79.2 },
];

// Mock data for water usage
const waterData = [
  { month: "Jan", usage: 52, cost: 34.84 },
  { month: "Feb", usage: 48, cost: 32.16 },
  { month: "Mar", usage: 50, cost: 33.5 },
  { month: "Apr", usage: 55, cost: 36.85 },
  { month: "May", usage: 60, cost: 40.2 },
  { month: "Jun", usage: 63, cost: 42.21 },
];

// Mock data for gas usage
const gasData = [
  { month: "Jan", usage: 78, cost: 72.54 },
  { month: "Feb", usage: 82, cost: 76.26 },
  { month: "Mar", usage: 75, cost: 69.75 },
  { month: "Apr", usage: 68, cost: 63.24 },
  { month: "May", usage: 65, cost: 60.45 },
  { month: "Jun", usage: 60, cost: 55.8 },
];

// Mock data for internet usage
const internetData = [
  { month: "Jan", usage: 50, cost: 45 },
  { month: "Feb", usage: 50, cost: 45 },
  { month: "Mar", usage: 50, cost: 45 },
  { month: "Apr", usage: 50, cost: 45 },
  { month: "May", usage: 50, cost: 45 },
  { month: "Jun", usage: 50, cost: 45 },
];

// Mock data for overall utility breakdown
const utilityBreakdown = [
  { name: "Electricity", value: 403.2 },
  { name: "Water", value: 219.76 },
  { name: "Gas", value: 398.04 },
  { name: "Internet", value: 270 },
];

const Analytics = () => {
  const [utilityType, setUtilityType] = useState("electricity");
  const [chartView, setChartView] = useState("usage");

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

  // Get utility color based on type
  const getUtilityColor = () => {
    switch (utilityType) {
      case "electricity":
        return "#3b82f6"; // blue
      case "water":
        return "#0ea5e9"; // sky blue
      case "gas":
        return "#ef4444"; // red
      case "internet":
        return "#8b5cf6"; // purple
      default:
        return "#3b82f6"; // default blue
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize and analyze your utility consumption patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Utility Analysis</CardTitle>
                <CardDescription>
                  {chartView === "usage" ? "Monthly usage" : "Monthly cost"} for your selected utility
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
                  <Tooltip />
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
              Total expenditure by utility for the last 6 months
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
                    stroke="#10b981"
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
                  <span className="w-3 h-3 bg-utility-electricity rounded-full"></span>
                  <span className="text-sm">Electricity: $403.20</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-utility-water rounded-full"></span>
                  <span className="text-sm">Water: $219.76</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-utility-gas rounded-full"></span>
                  <span className="text-sm">Gas: $398.04</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-utility-internet rounded-full"></span>
                  <span className="text-sm">Internet: $270.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
