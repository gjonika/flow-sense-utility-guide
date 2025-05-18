
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, File, Filter, Upload, Trash2 } from "lucide-react";
import { UploadCSV } from "@/components/UploadCSV";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Reading = {
  id: string;
  readingdate: Date | string;
  utilitytype: string;
  supplier: string;
  reading?: string | number;
  unit?: string;
  amount: number;
  notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
};

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>(undefined);
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>(undefined);
  const [filterPriceRange, setFilterPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [suppliers, setSuppliers] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [filtersPopoverOpen, setFiltersPopoverOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
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
      
      // Extract unique suppliers and types
      const uniqueSuppliers = new Set<string>();
      const uniqueTypes = new Set<string>();
      
      data?.forEach(entry => {
        uniqueSuppliers.add(entry.supplier);
        uniqueTypes.add(entry.utilitytype);
      });
      
      setSuppliers(uniqueSuppliers);
      setTypes(uniqueTypes);
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

  // Update active filters when filter values change
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (filterType !== "all") newActiveFilters.push(`Type: ${filterType}`);
    if (filterSupplier !== "all") newActiveFilters.push(`Supplier: ${filterSupplier}`);
    if (filterDateFrom) newActiveFilters.push(`From: ${format(filterDateFrom, 'MMM d, yyyy')}`);
    if (filterDateTo) newActiveFilters.push(`To: ${format(filterDateTo, 'MMM d, yyyy')}`);
    if (filterPriceRange.min) newActiveFilters.push(`Min: $${filterPriceRange.min}`);
    if (filterPriceRange.max) newActiveFilters.push(`Max: $${filterPriceRange.max}`);
    
    setActiveFilters(newActiveFilters);
  }, [filterType, filterSupplier, filterDateFrom, filterDateTo, filterPriceRange]);

  // Filter readings based on all filters
  const filteredReadings = readings.filter((reading) => {
    // Search term filter
    const matchesSearch = 
      (reading.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      reading.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.utilitytype.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Utility type filter
    const matchesType = filterType === "all" || reading.utilitytype.toLowerCase() === filterType.toLowerCase();
    
    // Supplier filter
    const matchesSupplier = filterSupplier === "all" || reading.supplier === filterSupplier;
    
    // Date range filter
    let matchesDateRange = true;
    const readingDate = new Date(reading.readingdate);
    if (filterDateFrom) matchesDateRange = matchesDateRange && readingDate >= filterDateFrom;
    if (filterDateTo) matchesDateRange = matchesDateRange && readingDate <= filterDateTo;
    
    // Price range filter
    let matchesPriceRange = true;
    if (filterPriceRange.min) matchesPriceRange = matchesPriceRange && reading.amount >= parseFloat(filterPriceRange.min);
    if (filterPriceRange.max) matchesPriceRange = matchesPriceRange && reading.amount <= parseFloat(filterPriceRange.max);
    
    return matchesSearch && matchesType && matchesSupplier && matchesDateRange && matchesPriceRange;
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterSupplier("all");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
    setFilterPriceRange({ min: "", max: "" });
  };

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

  // Remove a single filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Type:")) setFilterType("all");
    else if (filter.startsWith("Supplier:")) setFilterSupplier("all");
    else if (filter.startsWith("From:")) setFilterDateFrom(undefined);
    else if (filter.startsWith("To:")) setFilterDateTo(undefined);
    else if (filter.startsWith("Min:")) setFilterPriceRange(prev => ({ ...prev, min: "" }));
    else if (filter.startsWith("Max:")) setFilterPriceRange(prev => ({ ...prev, max: "" }));
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

      {/* Basic Filters */}
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
              {Array.from(types).sort().map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Advanced Filters */}
        <Popover open={filtersPopoverOpen} onOpenChange={setFiltersPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              
              {/* Supplier filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {Array.from(suppliers).sort().map(supplier => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateFrom ? format(filterDateFrom, 'PPP') : 'From date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateFrom}
                        onSelect={setFilterDateFrom}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDateTo ? format(filterDateTo, 'PPP') : 'To date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDateTo}
                        onSelect={setFilterDateTo}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Price range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filterPriceRange.min}
                    onChange={(e) => setFilterPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <span>-</span>
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filterPriceRange.max}
                    onChange={(e) => setFilterPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFiltersPopoverOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            size="sm"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="px-2 py-1"
            >
              {filter}
              <button 
                className="ml-1 hover:text-destructive" 
                onClick={() => removeFilter(filter)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

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
                  <TableCell className="capitalize">{reading.utilitytype}</TableCell>
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
      </AlertDialog>
    </div>
  );
};

export default History;
