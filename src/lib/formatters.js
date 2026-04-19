/**
 * Format a number for the central circle display.
 * Rules: round to nearest tenth, max 2 decimal places, auto M/B/K suffix.
 */
export function formatCircleValue(value) {
  if (value === null || value === undefined || value === '' || isNaN(value)) return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'

  const abs = Math.abs(num)
  if (abs >= 1_000_000_000) return trimDecimals(num / 1_000_000_000) + 'B'
  if (abs >= 1_000_000)     return trimDecimals(num / 1_000_000) + 'M'
  if (abs >= 1_000)         return trimDecimals(num / 1_000) + 'K'
  return trimDecimals(num)
}

function trimDecimals(n) {
  // Max 2 decimal places, trim trailing zeros, max precision 1 decimal for readability
  const fixed = parseFloat(n.toFixed(1))
  return fixed % 1 === 0 ? fixed.toFixed(0) : fixed.toFixed(1)
}

/**
 * Format a number for table display.
 * Max 2 decimal places with locale separators.
 */
export function formatTableValue(value) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return parseFloat(num.toFixed(2)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Get top N countries by latest available value.
 */
export function getTopCountries(data, n = 3) {
  if (!data?.length) return []

  // Collapse to latest period per country
  const latest = {}
  data.forEach(item => {
    const id = item.countryRegionId
    if (!latest[id] || String(item.period) > String(latest[id].period)) {
      latest[id] = item
    }
  })

  return Object.values(latest)
    .filter(item => item.value != null && !isNaN(parseFloat(item.value)) && parseFloat(item.value) > 0)
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
    .slice(0, n)
}

/**
 * Get the most recent world total data point.
 */
export function getLatestWorldValue(data) {
  if (!data?.length) return null
  return [...data].sort((a, b) => String(b.period).localeCompare(String(a.period)))[0] ?? null
}

/**
 * Format a period string for chart axis labels.
 */
export function formatPeriod(period, frequency) {
  if (!period) return ''
  const str = String(period)
  if (frequency === 'annual') return str
  if (frequency === 'monthly') {
    const [year, month] = str.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[(parseInt(month, 10) - 1)] ?? month} ${year}`
  }
  // daily: return short date
  return str.slice(5) // MM-DD
}
