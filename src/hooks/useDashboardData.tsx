
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { filterDataByYear } from "@/lib/data-utils";

interface UtilityReading {
  utilitytype: string;
  reading: number;
  unit: string;
  month?: string;
  readingdate?: string;
  amount?: number;
}

interface UtilityCardData {
  title: string;
  value: string;
  change: string;
  type: "increase" | "decrease" | "neutral";
  color: string;
}

export const useDashboardData = (selectedYear: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasReadings, setHasReadings] = useState<boolean>(false);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [utilityCards, setUtilityCards] = useState<UtilityCardData[]>([]);

  useEffect(() => {
    fetchReadingsData();
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
  const getLatestReadings = (data: any[]): UtilityCardData[] => {
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
      let changeType: "increase" | "decrease" | "neutral" = "neutral";
      
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
      } as UtilityCardData;
    }).filter(Boolean) as UtilityCardData[];
    
    return latestByType;
  };

  return { isLoading, hasReadings, monthlyData, utilityCards, fetchReadingsData };
};
