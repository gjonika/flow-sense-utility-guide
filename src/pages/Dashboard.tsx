
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { UtilityChart } from "@/components/UtilityChart";
import { Button } from "@/components/ui/button";
import { UtilityCard } from "@/components/UtilityCard";
import { RecentReadingsTable } from "@/components/RecentReadingsTable";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Welcome toast on first load
    toast({
      title: "Welcome to UtilityFlow",
      description: "Track and analyze your utility usage over time.",
    });
  }, []);

  // Data for last 6 months - normally would come from API
  const monthlyData = [
    { month: "Jan", electricity: 95, water: 52, gas: 78, internet: 50 },
    { month: "Feb", electricity: 85, water: 48, gas: 82, internet: 50 },
    { month: "Mar", electricity: 78, water: 50, gas: 75, internet: 50 },
    { month: "Apr", electricity: 90, water: 55, gas: 68, internet: 50 },
    { month: "May", electricity: 102, water: 60, gas: 65, internet: 50 },
    { month: "Jun", electricity: 110, water: 63, gas: 60, internet: 50 },
  ];

  const utilityCards = [
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
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your utility consumption and costs
          </p>
        </div>
        <Button 
          onClick={() => navigate("/add-reading")}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Reading</span>
        </Button>
      </div>

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
              Monthly utility consumption over the last 6 months
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
    </div>
  );
};

export default Dashboard;
