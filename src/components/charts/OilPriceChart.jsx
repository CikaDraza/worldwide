import { ResponsiveContainer, LineChart, Line, Tooltip, ReferenceLine } from 'recharts'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorBlock from '../ui/ErrorBlock'

function MiniChart({ data, color }) {
  const chartData = [...(data || [])].slice(0, 60).reverse().map(d => ({ v: parseFloat(d.value) || 0 }))
  if (!chartData.length) return null
  const vals = chartData.map(d => d.v)
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length

  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={chartData}>
        <ReferenceLine y={avg} stroke={color} strokeOpacity={0.2} strokeDasharray="3 3" />
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.[0] ? (
              <div className="text-[10px] bg-[#111] border border-[#333] rounded px-2 py-1" style={{ color }}>
                ${payload[0].value?.toFixed(2)}
              </div>
            ) : null
          }
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function PriceCard({ label, ticker, data, color, loading, error, onRetry }) {
  if (loading) return (
    <div className="flex-1 bg-[#111] rounded-xl p-3 border border-[#2a2a2a] flex items-center justify-center h-28">
      <LoadingSpinner size={18} />
    </div>
  )
  if (error) return (
    <div className="flex-1">
      <ErrorBlock message={error} onRetry={onRetry} label={`${label} price`} />
    </div>
  )

  const latest = data?.[0]
  const prev = data?.[1]
  const change = latest && prev ? parseFloat(latest.value) - parseFloat(prev.value) : null
  const pct = change && prev ? (change / parseFloat(prev.value)) * 100 : null
  const isUp = change > 0

  return (
    <div className="flex-1 bg-[#111] rounded-xl p-3 border border-[#2a2a2a] hover:border-[#333] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-[10px] text-gray-700">{ticker}</p>
        </div>
        {change != null && (
          <span className={`text-[10px] font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold tabular-nums leading-none mb-2" style={{ color }}>
        ${parseFloat(latest?.value ?? 0).toFixed(2)}
      </p>
      <MiniChart data={data} color={color} />
      <p className="text-[9px] text-gray-700 mt-1">{latest?.period}</p>
    </div>
  )
}

export default function OilPriceChart({ wti, brent, wtiLoading, brentLoading, wtiError, brentError, onRetryWTI, onRetryBrent }) {
  return (
    <div className="flex gap-2">
      <PriceCard label="WTI" ticker="RWTC" data={wti} color="#F59E0B" loading={wtiLoading} error={wtiError} onRetry={onRetryWTI} />
      <PriceCard label="Brent" ticker="RBRTE" data={brent} color="#66C7DC" loading={brentLoading} error={brentError} onRetry={onRetryBrent} />
    </div>
  )
}
