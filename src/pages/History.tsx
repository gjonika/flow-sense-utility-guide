
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UploadCSV } from "@/components/UploadCSV";
import { File, Upload, Trash2 } from "lucide-react";

type Reading = {
  id: string;
  readingdate: Date | string;  // Updated to accept both Date and string
  utilitytype: string;
  supplier: string;
  reading?: string | number;
  unit?: string;
  amount: number;
  notes?: string;
  created_at: Date | string;  // Also updated for consistency
  updated_at: Date | string;  // Also updated for consistency
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();

  // Fetch readings from Supabase
  const fetchReadings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('*')
        .order('readingdate', { ascending: false });
      
      if (error) throw error;
      
      setReadings(data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
      toast({
        title: "Error",
        description: "Failed to load utility readings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  // Filter readings based on search term and type filter
  const filteredReadings = readings.filter((reading) => {
    const matchesSearch = 
      (reading.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      reading.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.utilitytype.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || reading.utilitytype.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  // Handle successful import
  const handleImportSuccess = () => {
    setImportDialogOpen(false);
    fetchReadings();
    toast({
      title: "Success",
      description: "Entries imported successfully",
    });
  };

  // Handle delete all entries
  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from('utility_entries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all entries
      
      if (error) throw error;
      
      setDeleteConfirmOpen(false);
      fetchReadings();
      toast({
        title: "Success",
        description: "All entries have been deleted",
      });
    } catch (error) {
      console.error('Error deleting entries:', error);
      toast({
        title: "Error",
        description: "Failed to delete entries",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reading History</h1>
          <p className="text-muted-foreground">
            View and filter all your past utility readings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </Button>
          <Button 
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search readings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="internet">Internet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setFilterType("all");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Results */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading readings...
                </TableCell>
              </TableRow>
            ) : filteredReadings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No readings match the current filters
                </TableCell>
              </TableRow>
            ) : (
              filteredReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{formatDate(new Date(reading.readingdate))}</TableCell>
                  <TableCell>{reading.utilitytype}</TableCell>
                  <TableCell>{reading.supplier}</TableCell>
                  <TableCell>{reading.reading || '-'}</TableCell>
                  <TableCell>{reading.unit || '-'}</TableCell>
                  <TableCell>${reading.amount.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {reading.notes || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-right text-sm text-muted-foreground">
        Showing {filteredReadings.length} of {readings.length} readings
      </div>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Import Utility Entries</DialogTitle>
          </DialogHeader>
          <UploadCSV onSuccess={handleImportSuccess} onCancel={() => setImportDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your utility readings data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground">
              Yes, delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Dialog>
    </div>
  );
};

export default History;
