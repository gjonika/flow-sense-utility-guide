
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReadingEntry {
  id: string;
  readingdate: string;
  utilitytype: string;
  reading: number | null;
  unit: string | null;
  amount: number;
}

export function RecentReadingsTable() {
  const [readings, setReadings] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReadings = async () => {
      try {
        const { data, error } = await supabase
          .from('utility_entries')
          .select('id, readingdate, utilitytype, reading, unit, amount')
          .order('readingdate', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setReadings(data);
        }
      } catch (error) {
        console.error('Error fetching recent readings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentReadings();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground p-4 text-center">Loading recent readings...</p>;
  }

  if (readings.length === 0) {
    return <p className="text-sm text-muted-foreground p-4 text-center">No recent readings found.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reading</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map((reading) => (
            <TableRow key={reading.id}>
              <TableCell>{formatDate(new Date(reading.readingdate))}</TableCell>
              <TableCell>{reading.utilitytype.charAt(0).toUpperCase() + reading.utilitytype.slice(1)}</TableCell>
              <TableCell>{reading.reading !== null ? `${reading.reading} ${reading.unit || ''}` : '-'}</TableCell>
              <TableCell>${reading.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
