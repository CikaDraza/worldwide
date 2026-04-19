import { formatCircleValue } from '../../lib/formatters'
import LoadingSpinner from './LoadingSpinner'

/**
 * Central stats circle — matches Figma design.
 * Shows formatted value with auto M/B/K suffix, max 2 decimal places.
 */
export default function CentralCircle({ value, unit, year, label, color = '#20F3C7', loading = false }) {
  const displayValue = formatCircleValue(value)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer ring + glow */}
      <div className="relative">
        {/* Glow blur behind */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: color }}
        />
        {/* SVG ring */}
        <svg width="176" height="176" viewBox="0 0 176 176" className="relative z-10">
          {/* Background ring */}
          <circle cx="88" cy="88" r="80" fill="none" stroke="#1e1e1e" strokeWidth="2" />
          {/* Accent ring segments */}
          <circle
            cx="88" cy="88" r="80"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="502"
            strokeDashoffset="100"
            strokeLinecap="round"
            strokeOpacity="0.4"
            transform="rotate(-90 88 88)"
          />
          {/* Inner fill */}
          <circle
            cx="88" cy="88" r="72"
            fill={color + '0a'}
          />
          {/* Inner border */}
          <circle
            cx="88" cy="88" r="72"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Content centered inside ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {loading ? (
            <LoadingSpinner size={28} />
          ) : (
            <>
              {year && (
                <span className="text-[10px] text-gray-600 font-medium mb-1">{year}</span>
              )}
              <span
                className="text-4xl font-black tabular-nums leading-none tracking-tight"
                style={{ color }}
              >
                {displayValue}
              </span>
              <span className="text-[9px] text-gray-500 mt-2 text-center px-6 leading-tight max-w-[130px]">
                {unit}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Label below */}
      {label && (
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      )}
    </div>
  )
}
