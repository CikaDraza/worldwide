import { ENERGY_CONFIG } from '../constants/energyTypes'
import { useAppStore } from '../store/appStore'
import EnergySidebar from '../components/layout/EnergySidebar'
import EnergyPanel from '../components/layout/EnergyPanel'

export default function Dashboard() {
  const { activeEnergy } = useAppStore()
  const config = ENERGY_CONFIG[activeEnergy]

  return (
    <div className="flex h-full pt-14 overflow-hidden">
      {/* Left energy type sidebar */}
      <EnergySidebar />

      {/* Main panel area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Energy type header bar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#222] bg-[#111] flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color, boxShadow: `0 0 6px ${config.color}` }}
          />
          <h2 className="text-sm font-bold text-white">{config.label}</h2>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">{config.unitLabel}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-gray-600 bg-[#1e1e1e] px-2 py-1 rounded border border-[#2a2a2a]">
              EIA.gov Data
            </span>
          </div>
        </div>

        {/* Energy panel (same component for all 5 types) */}
        <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
          <EnergyPanel key={activeEnergy} />
        </div>
      </div>
    </div>
  )
}
