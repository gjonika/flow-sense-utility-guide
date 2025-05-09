
import { useState } from "react";
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

// Mock data
const allReadings = [
  {
    id: "r1",
    date: new Date(2023, 5, 15), // June 15, 2023
    utility: "Electricity",
    reading: "110 kWh",
    cost: "$78.50",
    notes: "Summer usage higher than normal"
  },
  {
    id: "r2",
    date: new Date(2023, 5, 10), // June 10, 2023
    utility: "Water",
    reading: "63 m³",
    cost: "$42.25",
    notes: ""
  },
  {
    id: "r3",
    date: new Date(2023, 5, 8), // June 8, 2023
    utility: "Gas",
    reading: "60 m³",
    cost: "$55.60",
    notes: "Reduced heating usage"
  },
  {
    id: "r4",
    date: new Date(2023, 5, 5), // June 5, 2023
    utility: "Internet",
    reading: "50 GB",
    cost: "$45.00",
    notes: ""
  },
  {
    id: "r5",
    date: new Date(2023, 4, 15), // May 15, 2023
    utility: "Electricity",
    reading: "102 kWh",
    cost: "$73.25",
    notes: ""
  },
  {
    id: "r6",
    date: new Date(2023, 4, 10), // May 10, 2023
    utility: "Water",
    reading: "60 m³",
    cost: "$39.75",
    notes: ""
  },
  {
    id: "r7",
    date: new Date(2023, 4, 8), // May 8, 2023
    utility: "Gas",
    reading: "65 m³",
    cost: "$60.40",
    notes: "Slightly higher than expected"
  },
  {
    id: "r8",
    date: new Date(2023, 4, 5), // May 5, 2023
    utility: "Internet",
    reading: "50 GB",
    cost: "$45.00",
    notes: ""
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredReadings = allReadings.filter((reading) => {
    const matchesSearch = reading.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.utility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || reading.utility.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading History</h1>
        <p className="text-muted-foreground">
          View and filter all your past utility readings
        </p>
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
              <TableHead>Reading</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="hidden md:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReadings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No readings match the current filters
                </TableCell>
              </TableRow>
            ) : (
              filteredReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{formatDate(reading.date)}</TableCell>
                  <TableCell>{reading.utility}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{reading.cost}</TableCell>
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
        Showing {filteredReadings.length} of {allReadings.length} readings
      </div>
    </div>
  );
};

export default History;
