
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
import { supabase } from "@/integrations/supabase/client";

interface UtilityReading {
  utilitytype: string;
  reading: number;
  unit: string;
  month?: string;
  readingdate?: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getColor } = useThemeStore();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasReadings, setHasReadings] = useState<boolean>(false);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [utilityCards, setUtilityCards] = useState<any[]>([]);
  const yearOptions = getYearOptions();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Apply default theme
    applyThemeColor(getColor('default'));

    // Welcome toast on first load
    toast({
      title: "Welcome to UtilityFlow",
      description: "Track and analyze your utility usage over time.",
    });

    // Fetch readings data
    fetchReadingsData();
  }, [toast, getColor]);

  useEffect(() => {
    // Process data when year changes
    if (hasReadings) {
      fetchReadingsData();
    }
  }, [selectedYear]);

  const fetchReadingsData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('*')
        .order('readingdate', { ascending: false });
      
      if (error) throw error;
      
      const hasEntries = Array.isArray(data) && data.length > 0;
      setHasReadings(hasEntries);
      
      if (hasEntries) {
        processReadingsData(data);
      } else {
        setMonthlyData([]);
        setUtilityCards([]);
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
      setHasReadings(false);
      setMonthlyData([]);
      setUtilityCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processReadingsData = (data: any[]) => {
    if (!data) return;
    
    // Generate monthly data for charts
    const processedMonthlyData = transformReadingsToMonthly(data);
    setMonthlyData(processedMonthlyData);
    
    // Generate utility cards data
    const latestReadings = getLatestReadings(data);
    setUtilityCards(latestReadings);
  };

  // Transform readings into monthly format for charts
  const transformReadingsToMonthly = (data: any[]) => {
    if (!data || !data.length) return [];
    
    // Filter by selected year
    const yearData = filterDataByYear(data, selectedYear);
    if (!yearData.length) return [];
    
    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAggregated = months.map(month => {
      const monthEntry: Record<string, any> = { month };
      
      // For each utility type, find readings from that month
      const utilityTypes = ['electricity', 'water', 'gas', 'internet'];
      utilityTypes.forEach(type => {
        const entry = yearData.find(d => {
          if (!d.readingdate) return false;
          const date = new Date(d.readingdate);
          return d.utilitytype === type && date.toLocaleString('default', { month: 'short' }) === month;
        });
        
        monthEntry[type] = entry ? parseFloat(entry.reading) : null;
      });
      
      return monthEntry;
    });
    
    // Filter out months with no data
    return monthlyAggregated.filter(m => 
      m.electricity !== null || m.water !== null || m.gas !== null || m.internet !== null
    );
  };

  // Get latest reading for each utility type
  const getLatestReadings = (data: any[]) => {
    if (!data || !data.length) return [];
    
    // Filter by selected year
    const yearData = filterDataByYear(data, selectedYear);
    if (!yearData.length) return [];
    
    const utilityTypes = ['electricity', 'water', 'gas', 'internet'];
    const latestByType = utilityTypes.map(type => {
      const entriesOfType = yearData.filter(d => d.utilitytype === type);
      if (!entriesOfType.length) return null;
      
      // Sort by date descending
      entriesOfType.sort((a, b) => {
        if (!a.readingdate || !b.readingdate) return 0;
        return new Date(b.readingdate).getTime() - new Date(a.readingdate).getTime();
      });
      
      const latest = entriesOfType[0];
      const previous = entriesOfType[1];
      
      // Calculate percentage change
      let change = "0%";
      let changeType = "neutral";
      
      if (previous && latest.reading && previous.reading) {
        const latestVal = parseFloat(latest.reading);
        const previousVal = parseFloat(previous.reading);
        
        if (previousVal > 0) {
          const percentChange = ((latestVal - previousVal) / previousVal) * 100;
          change = `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
          changeType = percentChange > 0 ? "increase" : percentChange < 0 ? "decrease" : "neutral";
        }
      }
      
      return {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        value: `${latest.reading} ${latest.unit || ''}`,
        change,
        type: changeType,
        color: `utility-${type}`
      };
    }).filter(Boolean);
    
    return latestByType;
  };

  const handleAddReading = () => {
    navigate("/add-reading");
  };

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
          {hasReadings && (
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
          )}
          <Button 
            onClick={handleAddReading}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{hasReadings ? "Add New Reading" : "Add Reading"}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center p-12">
            <p>Loading...</p>
          </CardContent>
        </Card>
      ) : hasReadings && utilityCards.length > 0 && monthlyData.length > 0 ? (
        <>
          {/* Utility Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilityCards.map((card, index) => (
              <UtilityCard
                key={`${card.title}-${index}`}
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
            {monthlyData.length > 0 && (
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
            )}

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
                {hasReadings 
                  ? `No readings found for ${selectedYear}. Try selecting a different year or add new readings.` 
                  : "You haven't added any readings yet. Add your first reading to start tracking your utility usage."}
              </p>
              <Button 
                onClick={handleAddReading}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{hasReadings ? "Add New Reading" : "Add Your First Reading"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
