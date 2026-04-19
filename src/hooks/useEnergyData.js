import { useState, useEffect, useCallback, useTransition } from 'react'
import {
  fetchWorldData,
  fetchCountriesDataBulk,
  fetchWTIDaily,
  fetchBrentDaily,
} from '../lib/api'
import { COUNTRY_IDS } from '../constants/energyTypes'

/**
 * World-level energy data: production + consumption fetched independently.
 * If one fails the other still loads — each has its own error + retry.
 * Uses React 19 useTransition for non-blocking state updates.
 */
export function useWorldEnergyData(energyType, productId, frequency) {
  const [production, setProduction] = useState([])
  const [consumption, setConsumption] = useState([])
  const [errors, setErrors] = useState({ production: null, consumption: null })
  const [loading, setLoading] = useState({ production: true, consumption: true })
  const [, startTransition] = useTransition()

  const fetchProduction = useCallback(async () => {
    setLoading(prev => ({ ...prev, production: true }))
    setErrors(prev => ({ ...prev, production: null }))
    try {
      const data = await fetchWorldData({ productId, activityId: '1', frequency })
      startTransition(() => setProduction(data))
    } catch (err) {
      setErrors(prev => ({ ...prev, production: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, production: false }))
    }
  }, [productId, frequency])

  const fetchConsumption = useCallback(async () => {
    setLoading(prev => ({ ...prev, consumption: true }))
    setErrors(prev => ({ ...prev, consumption: null }))
    try {
      const data = await fetchWorldData({ productId, activityId: '2', frequency })
      startTransition(() => setConsumption(data))
    } catch (err) {
      setErrors(prev => ({ ...prev, consumption: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, consumption: false }))
    }
  }, [productId, frequency])

  useEffect(() => { fetchProduction() }, [fetchProduction])
  useEffect(() => { fetchConsumption() }, [fetchConsumption])

  return {
    production, consumption, errors, loading,
    refetchProduction: fetchProduction,
    refetchConsumption: fetchConsumption,
  }
}

/**
 * Country-level data for one activity (production OR consumption).
 * Single request — if it fails, shows error + retry. Others are unaffected.
 */
export function useCountriesEnergyData(productId, activityId, frequency) {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  const doFetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchCountriesDataBulk({
        productId, activityId, frequency,
        countryIds: COUNTRY_IDS,
      })
      startTransition(() => setData(result.filter(r => r.countryRegionTypeId === 'c')))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productId, activityId, frequency])

  useEffect(() => { doFetch() }, [doFetch])

  return { data, error, loading, refetch: doFetch }
}

/**
 * WTI and Brent oil spot prices.
 * Each fetches independently — if WTI fails, Brent still loads and vice versa.
 */
export function useOilPrices() {
  const [wti, setWti] = useState([])
  const [brent, setBrent] = useState([])
  const [errors, setErrors] = useState({ wti: null, brent: null })
  const [loading, setLoading] = useState({ wti: true, brent: true })

  const refetchWTI = useCallback(async () => {
    setLoading(prev => ({ ...prev, wti: true }))
    setErrors(prev => ({ ...prev, wti: null }))
    try {
      const data = await fetchWTIDaily()
      setWti(data)
    } catch (err) {
      setErrors(prev => ({ ...prev, wti: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, wti: false }))
    }
  }, [])

  const refetchBrent = useCallback(async () => {
    setLoading(prev => ({ ...prev, brent: true }))
    setErrors(prev => ({ ...prev, brent: null }))
    try {
      const data = await fetchBrentDaily()
      setBrent(data)
    } catch (err) {
      setErrors(prev => ({ ...prev, brent: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, brent: false }))
    }
  }, [])

  useEffect(() => {
    // Fire both in parallel — independent error handling per price
    refetchWTI()
    refetchBrent()
  }, [refetchWTI, refetchBrent])

  return { wti, brent, errors, loading, refetchWTI, refetchBrent }
}

/**
 * Client-side pagination + sorting for any flat array of records.
 * Resets to page 0 whenever the data changes (e.g. filter or refetch).
 */
export function usePagination(data, initialPageSize = 10) {
  const [page, setPage] = useState(0)
  const [pageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' })

  const sorted = [...(data || [])].sort((a, b) => {
    const aVal = a[sortConfig.key] ?? 0
    const bVal = b[sortConfig.key] ?? 0
    // String sort for non-numeric fields
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    setPage(0)
  }, [])

  useEffect(() => { setPage(0) }, [data])

  return { paginated, page, setPage, pageSize, totalPages, sortConfig, handleSort }
}
