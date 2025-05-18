
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
  electricity?: number;
  water?: number;
  gas?: number;
  internet?: number;
  hotWater?: number;
  phone?: number;
  renovation?: number;
  interest?: number;
  insurance?: number;
  waste?: number;
  housing?: number;
  loan?: number;
}

interface UtilityChartProps {
  data: ChartData[];
}

export function UtilityChart({ data }: UtilityChartProps) {
  // Ensure we have at least 3 data points for a meaningful chart
  const paddedData = data.length < 3 ? [...Array(3 - data.length).fill({}).map((_, i) => ({
    month: `Prev ${i + 1}`,
  })), ...data] : data;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={paddedData}
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
          <Area
            type="monotone"
            dataKey="hotWater"
            name="HotWater"
            stackId="5"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="phone"
            name="Phone"
            stackId="6"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="renovation"
            name="Renovation"
            stackId="7"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="interest"
            name="Interest"
            stackId="8"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="insurance"
            name="Insurance"
            stackId="9"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="waste"
            name="Waste"
            stackId="10"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="housing"
            name="Housing"
            stackId="11"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="loan"
            name="Loan"
            stackId="12"
            stroke="#84cc16"
            fill="#84cc16"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
