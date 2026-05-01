import { useAppStore } from "../../store/appStore";
import { ENERGY_CONFIG, ENERGY_TYPES } from "../../constants/energyTypes";
import {
  useWorldEnergyData,
  useCountriesEnergyData,
  useOilPrices,
} from "../../hooks/useEnergyData";
import { getLatestWorldValue } from "../../lib/formatters";
import FrequencyBar from "./FrequencyBar";
import CentralCircle from "../ui/CentralCircle";
import TopCountries from "../ui/TopCountries";
import EnergyLineChart from "../charts/EnergyLineChart";
import OilPriceChart from "../charts/OilPriceChart";
import WorldMapVectorMap from "../map/WorldMapVectorMap";
import EnergyTable from "../table/EnergyTable";

export default function EnergyPanel() {
  const { activeEnergy, frequency, activeTab } = useAppStore();
  const config = ENERGY_CONFIG[activeEnergy];

  const {
    production: worldProd,
    consumption: worldCons,
    errors: worldErrors,
    loading: worldLoading,
    refetchProduction,
    refetchConsumption,
  } = useWorldEnergyData(activeEnergy, config.productId, frequency);

  const productionActivity = config.activityIds?.production ?? "1";
  const consumptionActivity = config.activityIds?.consumption ?? "2";

  const {
    data: countryProdData,
    error: countryProdError,
    loading: countryProdLoading,
    refetch: refetchCountryProd,
  } = useCountriesEnergyData(config.productId, productionActivity, frequency);

  const {
    data: countryConsData,
    error: countryConsError,
    loading: countryConsLoading,
    refetch: refetchCountryCons,
  } = useCountriesEnergyData(config.productId, consumptionActivity, frequency);

  const oilPrices = useOilPrices();

  const isProduction = activeTab === "production";
  const activeCountryData = isProduction ? countryProdData : countryConsData;
  const activeCountryError = isProduction ? countryProdError : countryConsError;
  const activeCountryLoading = isProduction
    ? countryProdLoading
    : countryConsLoading;
  const refetchActiveCountry = isProduction
    ? refetchCountryProd
    : refetchCountryCons;
  const activeWorldData = isProduction ? worldProd : worldCons;
  const latestWorld = getLatestWorldValue(activeWorldData);
  const circleLoading = isProduction
    ? worldLoading.production
    : worldLoading.consumption;

  // --- REUSABLE SECTIONS ---
  const LeftPanelContent = () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-center items-center pt-4 pb-6">
        <CentralCircle
          value={latestWorld?.value}
          unit={config.unitLabel}
          year={latestWorld?.period}
          label={isProduction ? "World Production" : "World Consumption"}
          color={config.color}
          loading={circleLoading}
        />
      </div>
      <div className="h-px bg-[#222]" />
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Top 3 Countries
          </h3>
          <span className="text-[10px] text-gray-600 capitalize">
            {activeTab}
          </span>
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
  );

  const RightPanelContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Countries</h3>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full border capitalize"
          style={{ borderColor: config.color + "40", color: config.color }}
        >
          {activeTab}
        </span>
      </div>
      <div className="flex-1">
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
  );

  return (
    <div className="flex flex-col h-full overflow-hidden fade-in">
      <FrequencyBar energyConfig={config} />

      {/* ── DESKTOP LAYOUT ─────────────────────────────────── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-96 border-r border-[#222] p-5 overflow-y-auto flex-shrink-0">
          <LeftPanelContent />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 p-5 border-b border-[#222] overflow-hidden min-h-0">
            {/* Map Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                World {isProduction ? "Production" : "Consumption"} Map
              </h3>
            </div>
            <WorldMapVectorMap
              data={activeCountryData}
              color={config.color}
              unit={config.unit}
              loading={activeCountryLoading}
            />
          </div>
          <div className="h-56 p-5 flex-shrink-0">
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

        <div className="w-96 border-l border-[#222] p-5 overflow-hidden flex-shrink-0">
          <RightPanelContent />
        </div>
      </div>

      {/* ── MOBILE LAYOUT ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col flex-1 overflow-y-auto bg-black">
        {/* 1. LEFT PANEL (at the top) */}
        <div className="p-5 border-b border-[#222]">
          <LeftPanelContent />
        </div>

        {/* 2. CENTRAL CONTENT (Map & Trends) */}
        <div className="p-5 border-b border-[#222]">
          <h3 className="text-sm font-semibold text-white mb-4">World Map</h3>
          <div className="h-[300px] mb-6">
            <WorldMapVectorMap
              data={activeCountryData}
              color={config.color}
              unit={config.unit}
              loading={activeCountryLoading}
            />
          </div>

          <h3 className="text-sm font-semibold text-white mb-2">
            Trend Analysis
          </h3>
          <div className="h-64">
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

        {/* 3. RIGHT PANEL (Countries Table at the bottom) */}
        <div className="p-2 md:p-5 min-h-[500px]">
          <RightPanelContent />
        </div>
      </div>
    </div>
  );
}
