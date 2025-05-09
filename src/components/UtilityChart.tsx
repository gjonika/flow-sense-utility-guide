
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  month: string;
  electricity: number;
  water: number;
  gas: number;
  internet: number;
}

interface UtilityChartProps {
  data: ChartData[];
}

export function UtilityChart({ data }: UtilityChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="electricity"
            name="Electricity"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="water"
            name="Water"
            stackId="2"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="gas"
            name="Gas"
            stackId="3"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="internet"
            name="Internet"
            stackId="4"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
