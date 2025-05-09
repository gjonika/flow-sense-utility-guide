
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { UtilityChart } from "@/components/UtilityChart";
import { Button } from "@/components/ui/button";
import { UtilityCard } from "@/components/UtilityCard";
import { RecentReadingsTable } from "@/components/RecentReadingsTable";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useThemeStore, applyThemeColor } from "@/lib/theme";
import { filterDataByYear, getYearOptions, hasData } from "@/lib/data-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getColor } = useThemeStore();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasReadings, setHasReadings] = useState<boolean>(true); // Simulate having readings
  const yearOptions = getYearOptions();

  useEffect(() => {
    // Apply default theme
    applyThemeColor(getColor('default'));

    // Welcome toast on first load
    toast({
      title: "Welcome to UtilityFlow",
      description: "Track and analyze your utility usage over time.",
    });

    // Check if we have readings data (simulated)
    // In a real app, you'd fetch this from your API or database
    setHasReadings(true); // simulate having data
  }, [toast, getColor]);

  // Data for last 6 months - normally would come from API
  // In a real app, you'd filter this based on the selected year
  const monthlyData = hasReadings ? [
    { month: "Jan", electricity: 95, water: 52, gas: 78, internet: 50 },
    { month: "Feb", electricity: 85, water: 48, gas: 82, internet: 50 },
    { month: "Mar", electricity: 78, water: 50, gas: 75, internet: 50 },
    { month: "Apr", electricity: 90, water: 55, gas: 68, internet: 50 },
    { month: "May", electricity: 102, water: 60, gas: 65, internet: 50 },
    { month: "Jun", electricity: 110, water: 63, gas: 60, internet: 50 },
  ] : [];

  const utilityCards = hasReadings ? [
    {
      title: "Electricity",
      value: "110 kWh",
      change: "+8%",
      type: "increase",
      color: "utility-electricity"
    },
    {
      title: "Water",
      value: "63 m³",
      change: "+5%",
      type: "increase",
      color: "utility-water"
    },
    {
      title: "Gas",
      value: "60 m³",
      change: "-7.7%",
      type: "decrease",
      color: "utility-gas"
    },
    {
      title: "Internet",
      value: "50 GB",
      change: "0%",
      type: "neutral",
      color: "utility-internet"
    },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your utility consumption and costs
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button 
            onClick={() => navigate("/add-reading")}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Reading</span>
          </Button>
        </div>
      </div>

      {hasReadings ? (
        <>
          {/* Utility Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilityCards.map((card) => (
              <UtilityCard
                key={card.title}
                title={card.title}
                value={card.value}
                change={card.change}
                type={card.type as "increase" | "decrease" | "neutral"}
                color={card.color}
              />
            ))}
          </div>

          {/* Charts and Tables */}
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
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to UtilityFlow</CardTitle>
            <CardDescription>
              Get started by adding your first utility reading
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-4">
                You haven't added any readings yet. Add your first reading to start tracking your utility usage.
              </p>
              <Button 
                onClick={() => navigate("/add-reading")}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Your First Reading</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
