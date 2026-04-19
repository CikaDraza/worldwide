const ICON_MAP = {
  oil: '/oil-fuel.svg',
  gas: '/mdi_gas.svg',
  nuclear: '/nuclear.svg',
  electric: '/electricity.svg',
  bio: '/green-energy.svg',
}

export default function EnergyIcon({ type, size = 24, active = false }) {
  const src = ICON_MAP[type]
  if (!src) return null

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={type}
      style={{
        opacity: active ? 1 : 0.4,
        filter: active ? 'none' : 'grayscale(1)',
        transition: 'opacity 0.2s, filter 0.2s',
      }}
    />
  )
}
