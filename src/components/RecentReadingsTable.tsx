
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

// Mock data for recent readings - would normally come from API
const recentReadings = [
  {
    id: "r1",
    date: new Date(2023, 5, 15), // June 15, 2023
    utility: "Electricity",
    reading: "110 kWh",
    cost: "$78.50",
  },
  {
    id: "r2",
    date: new Date(2023, 5, 10), // June 10, 2023
    utility: "Water",
    reading: "63 m³",
    cost: "$42.25",
  },
  {
    id: "r3",
    date: new Date(2023, 5, 8), // June 8, 2023
    utility: "Gas",
    reading: "60 m³",
    cost: "$55.60",
  },
  {
    id: "r4",
    date: new Date(2023, 5, 5), // June 5, 2023
    utility: "Internet",
    reading: "50 GB",
    cost: "$45.00",
  },
];

export function RecentReadingsTable() {
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
          {recentReadings.map((reading) => (
            <TableRow key={reading.id}>
              <TableCell>{formatDate(reading.date)}</TableCell>
              <TableCell>{reading.utility}</TableCell>
              <TableCell>{reading.reading}</TableCell>
              <TableCell>{reading.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
