
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReadingEntry {
  id: string;
  readingdate: string;
  utilitytype: string;
  reading: number | null;
  unit: string | null;
  amount: number;
}

interface UseRecentReadingsProps {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ascending' | 'descending';
}

export function useRecentReadings({
  limit = 5,
  orderBy = 'readingdate',
  orderDirection = 'descending'
}: UseRecentReadingsProps = {}) {
  const [readings, setReadings] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('utility_entries')
          .select('id, readingdate, utilitytype, reading, unit, amount')
          .order(orderBy, { ascending: orderDirection === 'ascending' })
          .limit(limit);
          
        if (error) throw new Error(error.message);
        
        setReadings(data || []);
      } catch (err) {
        console.error('Error fetching recent readings:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentReadings();
  }, [limit, orderBy, orderDirection]);

  const refetch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('id, readingdate, utilitytype, reading, unit, amount')
        .order(orderBy, { ascending: orderDirection === 'ascending' })
        .limit(limit);
        
      if (error) throw new Error(error.message);
      
      setReadings(data || []);
    } catch (err) {
      console.error('Error refetching recent readings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { readings, loading, error, refetch };
}
