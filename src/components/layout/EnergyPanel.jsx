import { useAppStore } from '../../store/appStore'
import { ENERGY_CONFIG, ENERGY_TYPES } from '../../constants/energyTypes'
import { useWorldEnergyData, useCountriesEnergyData, useOilPrices } from '../../hooks/useEnergyData'
import { getLatestWorldValue } from '../../lib/formatters'
import FrequencyBar from './FrequencyBar'
import CentralCircle from '../ui/CentralCircle'
import TopCountries from '../ui/TopCountries'
import EnergyLineChart from '../charts/EnergyLineChart'
import OilPriceChart from '../charts/OilPriceChart'
import WorldMapVectorMap from '../map/WorldMapVectorMap'
import EnergyTable from '../table/EnergyTable'

// useOilPrices is always called (Rules of Hooks), but rendered only for OIL type
export default function EnergyPanel() {
  const { activeEnergy, frequency, activeTab } = useAppStore()
  const config = ENERGY_CONFIG[activeEnergy]

  const {
    production: worldProd,
    consumption: worldCons,
    errors: worldErrors,
    loading: worldLoading,
    refetchProduction,
    refetchConsumption,
  } = useWorldEnergyData(activeEnergy, config.productId, frequency)

  const productionActivity = config.activityIds?.production ?? '1'
  const consumptionActivity = config.activityIds?.consumption ?? '2'

  const {
    data: countryProdData, error: countryProdError,
    loading: countryProdLoading, refetch: refetchCountryProd,
  } = useCountriesEnergyData(config.productId, productionActivity, frequency)

  const {
    data: countryConsData, error: countryConsError,
    loading: countryConsLoading, refetch: refetchCountryCons,
  } = useCountriesEnergyData(config.productId, consumptionActivity, frequency)

  // Always call — Rules of Hooks. Renders conditionally below.
  const oilPrices = useOilPrices()

  const isProduction = activeTab === 'production'
  const activeCountryData = isProduction ? countryProdData : countryConsData
  const activeCountryError = isProduction ? countryProdError : countryConsError
  const activeCountryLoading = isProduction ? countryProdLoading : countryConsLoading
  const refetchActiveCountry = isProduction ? refetchCountryProd : refetchCountryCons
  const activeWorldData = isProduction ? worldProd : worldCons
  const latestWorld = getLatestWorldValue(activeWorldData)
  const circleLoading = isProduction ? worldLoading.production : worldLoading.consumption

  return (
    <div className="flex flex-col h-full overflow-hidden fade-in">
      <FrequencyBar energyConfig={config} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <div className="w-72 border-r border-[#222] flex flex-col gap-5 p-5 overflow-y-auto flex-shrink-0">

          {/* Central circle */}
          <div className="flex flex-col items-center pt-4 pb-6">
            <CentralCircle
              value={latestWorld?.value}
              unit={config.unitLabel}
              year={latestWorld?.period}
              label={isProduction ? 'World Production' : 'World Consumption'}
              color={config.color}
              loading={circleLoading}
            />
          </div>

          <div className="h-px bg-[#222]" />

          {/* Top 3 Countries */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Top 3 Countries
              </h3>
              <span className="text-[10px] text-gray-600 capitalize">{activeTab}</span>
            </div>
            <TopCountries
              data={activeCountryData}
              loading={activeCountryLoading}
              error={activeCountryError}
              onRetry={refetchActiveCountry}
              color={config.color}
              unit={config.unit}
            />
          </section>

          {/* Oil Prices – only shown for Oil energy type */}
          {activeEnergy === ENERGY_TYPES.OIL && (
            <>
              <div className="h-px bg-[#222]" />
              <section>
                <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Spot Prices
                </h3>
                <OilPriceChart
                  wti={oilPrices.wti}
                  brent={oilPrices.brent}
                  wtiLoading={oilPrices.loading.wti}
                  brentLoading={oilPrices.loading.brent}
                  wtiError={oilPrices.errors.wti}
                  brentError={oilPrices.errors.brent}
                  onRetryWTI={oilPrices.refetchWTI}
                  onRetryBrent={oilPrices.refetchBrent}
                />
              </section>
            </>
          )}
        </div>

        {/* ── CENTER: Map + Trend chart ───────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* World Map */}
          <div className="flex-1 p-5 border-b border-[#222] overflow-hidden min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                World {isProduction ? 'Production' : 'Consumption'} Map
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded inline-block" style={{ background: '#1e1e1e', border: '1px solid #333' }} />
                  No data
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded inline-block" style={{ background: config.color + '60' }} />
                  Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-2 rounded inline-block" style={{ background: config.color }} />
                  High
                </span>
              </div>
            </div>
            <WorldMapVectorMap
              countryData={activeCountryData}
              color={config.color}
              unit={config.unit}
              loading={activeCountryLoading}
            />
          </div>

          {/* Trend chart */}
          <div className="h-56 p-5 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">
                {config.label} — World Trend
              </h3>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: config.color }}>
                  <span className="w-3 h-0.5 inline-block" style={{ background: config.color }} />
                  {isProduction ? 'Production' : 'Consumption'}
                </span>
                <span className="text-[10px] text-gray-600">{config.unit}</span>
              </div>
            </div>
            <EnergyLineChart
              productionData={worldProd}
              consumptionData={worldCons}
              productionLoading={worldLoading.production}
              consumptionLoading={worldLoading.consumption}
              productionError={worldErrors.production}
              consumptionError={worldErrors.consumption}
              onRetryProduction={refetchProduction}
              onRetryConsumption={refetchConsumption}
              color={config.color}
              unit={config.unit}
              frequency={frequency}
              activeTab={activeTab}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL: Countries table ────────────────── */}
        <div className="w-80 border-l border-[#222] flex flex-col p-5 overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Countries</h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full border capitalize"
              style={{ borderColor: config.color + '40', color: config.color }}
            >
              {activeTab}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EnergyTable
              data={activeCountryData}
              loading={activeCountryLoading}
              error={activeCountryError}
              onRetry={refetchActiveCountry}
              unit={config.unit}
              color={config.color}
              label={`${config.label} ${activeTab}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
