# Worldwide Energy Dashboard

A React 19 SPA for monitoring global energy data (Oil, Gas, Nuclear, Electricity, Bio Energy) via the EIA.gov API.

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env and set your EIA API key
npm run dev
```

## Environment Variables

```env
VITE_EIA_API_KEY=your_eia_api_key_here
```

Get a free API key at: https://www.eia.gov/opendata/

## Folder Structure

```
src/
├── components/
│   ├── charts/         # Recharts graph components
│   │   ├── EnergyLineChart.jsx
│   │   └── OilPriceChart.jsx
│   ├── layout/         # Layout/container components
│   │   ├── EnergyPanel.jsx     # Main panel (same for all 5 energy types)
│   │   ├── EnergySidebar.jsx   # Left energy-type switcher
│   │   ├── FrequencyBar.jsx    # Daily/Monthly/Annual + Production/Consumption
│   │   └── Navbar.jsx
│   ├── map/            # World vector map
│   │   └── WorldMapVectorMap.jsx
│   ├── table/          # Paginated country table
│   │   └── EnergyTable.jsx
│   └── ui/             # Pure UI primitives
│       ├── CentralCircle.jsx
│       ├── EnergyIcon.jsx
│       ├── ErrorBlock.jsx
│       ├── LoadingSpinner.jsx
│       └── TopCountries.jsx
├── constants/
│   └── energyTypes.js    # All 5 energy types: IDs, colors, units
├── hooks/
│   └── useEnergyData.js  # All data-fetching hooks
├── lib/
│   ├── api.js            # All EIA API calls (key via env)
│   └── formatters.js     # Number formatting utilities
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx         # UI only, no backend
│   └── Register.jsx      # UI only, no backend
└── store/
    └── appStore.jsx      # React context + useTransition for global state
```

## Features

- **5 energy types**: Oil (WTI/Brent), Natural Gas (NLG/BTU), Nuclear, Electricity, Bio Energy
- **Production & Consumption** per energy type
- **Daily / Monthly / Annual** frequency selector
- **World map** with color-coded country data (ISO3→ISO2 mapped)
- **Top 3 countries** per energy type and activity
- **Trend chart** (Recharts AreaChart, transparent background)
- **Paginated country table** (10 per page, sortable, searchable)
- **Oil spot prices** (WTI + Brent with mini sparkline and % change)
- **Central circle**: auto-formats to M/B/K with max 2 decimal places
- **Independent error handling**: each fetch fails separately with Retry button
- **React 19 `useTransition`** for smooth UI transitions on energy type switch
- **Dark theme only**
- **API key in `.env`** — never in source code

## Data Sources (EIA API v2)

| Energy Type | EIA Product ID | Unit |
|---|---|---|
| Oil | 4415 | Thousand Barrels/Day |
| Natural Gas | 26 | Quadrillion BTU |
| Nuclear | 14 | Quadrillion BTU |
| Electricity | 2 | Billion kWh |
| Bio Energy | 44 | Quadrillion BTU |

## Dependencies

- `react` 19, `react-dom` 19, `react-router-dom` 6
- `recharts` — charts
- `@react-jvectormap/core` + `@react-jvectormap/world` — world map
- `tailwindcss` — styling
