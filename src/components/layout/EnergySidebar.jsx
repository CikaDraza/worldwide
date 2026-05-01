import { ENERGY_CONFIG } from "../../constants/energyTypes";
import { useAppStore } from "../../store/appStore";
import EnergyIcon from "../ui/EnergyIcon";

export default function EnergySidebar() {
  const { activeEnergy, setActiveEnergy } = useAppStore();

  return (
    <aside className="w-20 bg-[#252525] border-r border-[#333] flex flex-col items-center py-6 gap-2 min-h-screen">
      {Object.entries(ENERGY_CONFIG).map(([type, config]) => {
        const isActive = activeEnergy === type;
        return (
          <button
            key={type}
            onClick={() => setActiveEnergy(type)}
            title={config.label}
            className={`
              w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all
              ${
                isActive
                  ? "bg-[#1a1a1a] border border-[#20F3C7]/40 shadow-[0_0_12px_rgba(32,243,199,0.15)]"
                  : "hover:bg-[#2e2e2e] border border-transparent"
              }
            `}
          >
            <EnergyIcon type={type} size={22} active={isActive} />
            <span
              className="text-[8px] font-medium leading-none truncate w-full text-center px-1"
              style={{ color: isActive ? config.color : "#6b7280" }}
            >
              {config.label.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
