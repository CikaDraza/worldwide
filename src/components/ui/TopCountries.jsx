import { getTopCountries } from '../../lib/formatters'
import { formatTableValue } from '../../lib/formatters'
import LoadingSpinner from './LoadingSpinner'
import ErrorBlock from './ErrorBlock'

export default function TopCountries({ data, loading, error, onRetry, color = '#20F3C7', unit }) {
  if (loading) return <div className="flex justify-center py-6"><LoadingSpinner label="Loading top countries..." /></div>
  if (error) return <ErrorBlock message={error} onRetry={onRetry} label="top countries" />

  const top = getTopCountries(data, 3)

  if (!top.length) return (
    <div className="text-center text-gray-600 text-sm py-4">No data available</div>
  )

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="space-y-2">
      {top.map((item, i) => (
        <div
          key={item.countryRegionId}
          className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg leading-none">{medals[i]}</span>
            <div>
              <div className="text-sm font-medium text-white">{item.countryRegionName}</div>
              <div className="text-xs text-gray-500">{item.period}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold tabular-nums" style={{ color }}>
              {formatTableValue(item.value)}
            </div>
            <div className="text-[10px] text-gray-600">{unit}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
