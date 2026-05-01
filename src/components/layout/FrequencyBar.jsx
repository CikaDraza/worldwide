import { FREQUENCY, ENERGY_CONFIG } from "../../constants/energyTypes";

import { useAppStore } from "../../store/appStore";

const FREQS = [
  { value: FREQUENCY.MONTHLY, label: "Monthly" },
  { value: FREQUENCY.ANNUAL, label: "Annual" },
];

export default function FrequencyBar({ energyConfig }) {
  const { frequency, setFrequency, activeTab, setActiveTab } = useAppStore();
  const accentColor = energyConfig?.color ?? "#20F3C7";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-b border-[#222] bg-[#1a1a1a]">
      {/* Production / Consumption toggle */}
      <div className="flex items-center bg-[#252525] rounded-lg p-0.5 gap-0.5">
        {["production", "consumption"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[#1a1a1a] text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
            style={activeTab === tab ? { color: accentColor } : {}}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Frequency selector */}
      <div className="flex items-center gap-6 mt-6 md:mt-0">
        {FREQS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFrequency(f.value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              frequency === f.value
                ? "text-white border"
                : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}
            style={
              frequency === f.value
                ? {
                    borderColor: accentColor,
                    color: accentColor,
                    backgroundColor: `${accentColor}15`,
                  }
                : {}
            }
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
