import { useState, useMemo } from 'react'
import { formatTableValue } from '../../lib/formatters'
import { usePagination } from '../../hooks/useEnergyData'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorBlock from '../ui/ErrorBlock'

function SortIcon({ active, direction }) {
  return (
    <span className="ml-1 inline-flex flex-col gap-[2px]">
      <span className={`block w-0 h-0 border-l-[4px] border-r-[4px] border-b-[5px] border-l-transparent border-r-transparent ${active && direction === 'asc' ? 'border-b-[#20F3C7]' : 'border-b-[#444]'}`} />
      <span className={`block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${active && direction === 'desc' ? 'border-t-[#20F3C7]' : 'border-t-[#444]'}`} />
    </span>
  )
}

export default function EnergyTable({ data, loading, error, onRetry, unit, color = '#20F3C7', label }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data?.length) return []
    const q = search.toLowerCase()
    return data.filter(d =>
      (d.countryRegionName || d.countryRegionId || '').toLowerCase().includes(q)
    )
  }, [data, search])

  const { paginated, page, setPage, pageSize, totalPages, sortConfig, handleSort } = usePagination(filtered, 10)

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size={28} label={`Loading ${label} data...`} />
    </div>
  )
  if (error) return <ErrorBlock message={error} onRetry={onRetry} label={label} />

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search country..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>
        <span className="text-xs text-gray-600">{filtered.length} countries</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#1e1e1e]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-8">#</th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-300 select-none"
                onClick={() => handleSort('countryRegionName')}
              >
                Country <SortIcon active={sortConfig.key === 'countryRegionName'} direction={sortConfig.direction} />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-300 select-none"
                onClick={() => handleSort('period')}
              >
                Period <SortIcon active={sortConfig.key === 'period'} direction={sortConfig.direction} />
              </th>
              <th
                className="text-right px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-300 select-none"
                onClick={() => handleSort('value')}
              >
                Value ({unit}) <SortIcon active={sortConfig.key === 'value'} direction={sortConfig.direction} />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-600 text-sm">No data found</td>
              </tr>
            ) : paginated.map((row, i) => (
              <tr
                key={`${row.countryRegionId}-${row.period}-${i}`}
                className="border-b border-[#1e1e1e] hover:bg-[#1e1e1e] transition-colors"
              >
                <td className="px-4 py-2.5 text-gray-600 text-xs">{page * 10 + i + 1}</td>
                <td className="px-4 py-2.5 text-white font-medium">{row.countryRegionName || row.countryRegionId}</td>
                <td className="px-4 py-2.5 text-gray-400">{row.period}</td>
                <td className="px-4 py-2.5 text-right font-mono font-semibold tabular-nums" style={{ color }}>
                  {formatTableValue(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-[#333] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >«</button>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-[#333] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >‹</button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(0, Math.min(page - 2, totalPages - 5))
              const p = start + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-7 h-7 text-xs rounded border transition-colors"
                  style={p === page
                    ? { borderColor: color, color, backgroundColor: color + '15' }
                    : { borderColor: '#333', color: '#6b7280' }
                  }
                >{p + 1}</button>
              )
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-[#333] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >›</button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-[#333] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >»</button>
          </div>
        </div>
      )}
    </div>
  )
}
