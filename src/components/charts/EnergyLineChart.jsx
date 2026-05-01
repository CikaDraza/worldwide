import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatPeriod } from "../../lib/formatters";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorBlock from "../ui/ErrorBlock";

function CustomTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs shadow-2xl">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="font-bold tabular-nums"
          style={{ color: entry.color }}
        >
          {entry.name}: {parseFloat(entry.value).toFixed(2)}{" "}
          <span className="font-normal text-gray-600">{unit}</span>
        </p>
      ))}
    </div>
  );
}

function YAxisFormatter(v) {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}K`;
  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  return parseFloat(v.toFixed(1));
}

export default function EnergyLineChart({
  productionData,
  consumptionData,
  productionLoading,
  consumptionLoading,
  productionError,
  consumptionError,
  onRetryProduction,
  onRetryConsumption,
  color = "#20F3C7",
  unit,
  frequency,
  activeTab,
}) {
  const loading =
    activeTab === "production" ? productionLoading : consumptionLoading;
  const error = activeTab === "production" ? productionError : consumptionError;
  const onRetry =
    activeTab === "production" ? onRetryProduction : onRetryConsumption;
  const raw = activeTab === "production" ? productionData : consumptionData;

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner size={24} label="Loading chart..." />
      </div>
    );
  if (error)
    return <ErrorBlock message={error} onRetry={onRetry} label="chart data" />;

  const chartData = [...(raw || [])]
    .filter((d) => d.value != null)
    .sort((a, b) => String(a.period).localeCompare(String(b.period)))
    .slice(-24)
    .map((d) => ({
      period: formatPeriod(d.period, frequency),
      value: parseFloat(d.value) || 0,
    }));

  if (!chartData.length)
    return (
      <div className="flex items-center justify-center h-40 text-gray-700 text-sm">
        No data available
      </div>
    );

  const gradId = `area-grad-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f1f2e"
          vertical={false}
        />
        <XAxis
          dataKey="period"
          tick={{ fill: "#4b5563", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#4b5563", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={YAxisFormatter}
          width={44}
        />
        <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "#111", strokeWidth: 2 }}
          name={activeTab === "production" ? "Production" : "Consumption"}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
