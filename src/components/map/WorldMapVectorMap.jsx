import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useState } from 'react'
import { formatCircleValue } from '../../lib/formatters'
import LoadingSpinner from '../ui/LoadingSpinner'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const ISO3_TO_NUMERIC = {
  USA:'840',CAN:'124',CHN:'156',RUS:'643',DEU:'276',GBR:'826',FRA:'250',JPN:'392',
  IND:'356',BRA:'076',AUS:'036',KOR:'410',MEX:'484',IDN:'360',SAU:'682',TUR:'792',
  NLD:'528',CHE:'756',ARG:'032',POL:'616',SWE:'752',BEL:'056',NOR:'578',AUT:'040',
  ARE:'784',ZAF:'710',NGA:'566',EGY:'818',IRN:'364',IRQ:'368',VEN:'862',COL:'170',
  THA:'764',MYS:'458',PHL:'608',VNM:'704',PAK:'586',BGD:'050',AGO:'024',DZA:'012',
  LBY:'434',KWT:'414',QAT:'634',OMN:'512',KAZ:'398',UZB:'860',AZE:'031',TKM:'795',
  UKR:'804',ROU:'642',CZE:'203',HUN:'348',PRT:'620',GRC:'300',FIN:'246',DNK:'208',
  NZL:'554',CHL:'152',PER:'604',ECU:'218',BOL:'068',PRY:'600',URY:'858',GTM:'320',
  CUB:'192',DOM:'214',CRI:'188',PAN:'591',TTO:'780',JAM:'388',BLR:'112',SVK:'703',
  BGR:'100',HRV:'191',SVN:'705',SRB:'688',MKD:'807',ALB:'008',BIH:'070',MNE:'499',
  LTU:'440',LVA:'428',EST:'233',GEO:'268',ARM:'051',MDA:'498',ISL:'352',IRL:'372',
  LUX:'442',CYP:'196',MLT:'470',ISR:'376',JOR:'400',LBN:'422',SYR:'760',YEM:'887',
  MAR:'504',TUN:'788',ETH:'231',KEN:'404',TZA:'834',UGA:'800',MOZ:'508',ZMB:'894',
  ZWE:'716',GHA:'288',CIV:'384',SEN:'686',CMR:'120',COD:'180',COG:'178',GAB:'266',
  SDN:'736',SSD:'728',SOM:'706',LBR:'430',SLE:'694',GIN:'324',MLI:'466',NER:'562',
  BFA:'854',TCD:'148',MRT:'478',BWA:'072',NAM:'516',LSO:'426',SWZ:'748',RWA:'646',
  BDI:'108',MWI:'454',MDG:'450',TGO:'768',BEN:'204',NIC:'558',HND:'340',SLV:'222',
  HTI:'332',BLZ:'084',GUY:'328',SUR:'740',PNG:'598',FJI:'242',SGP:'702',HKG:'344',
  MAC:'446',TWN:'158',MNG:'496',KGZ:'417',TJK:'762',AFG:'004',MMR:'104',KHM:'116',
  LAO:'418',BTN:'064',NPL:'524',LKA:'144',MDV:'462',BRN:'096',PRI:'630',GRL:'304',
  NCL:'540',
}

function buildSeriesMap(countryData) {
  const map = {}
  if (!countryData?.length) return map
  countryData.forEach(item => {
    const num = ISO3_TO_NUMERIC[item.countryRegionId]
    if (num && item.value != null) {
      map[num] = { value: parseFloat(item.value) || 0, name: item.countryRegionName, id: item.countryRegionId }
    }
  })
  return map
}

function getCountryColor(value, max, color) {
  if (!value || !max) return '#1e1e2e'
  const ratio = Math.pow(value / max, 0.4)
  const hex = Math.round(ratio * 200 + 30).toString(16).padStart(2, '0')
  return color + hex
}

export default function WorldMapVectorMap({ countryData, color = '#20F3C7', unit, loading }) {
  const [tooltip, setTooltip] = useState(null)
  const seriesMap = buildSeriesMap(countryData)
  const maxVal = Object.values(seriesMap).reduce((m, d) => Math.max(m, d.value), 0)

  return (
    <div className="relative w-full" style={{ height: 300 }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/70 z-10 rounded-xl">
          <LoadingSpinner size={28} label="Loading map data..." />
        </div>
      )}

      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 px-3 py-2 rounded-xl text-xs"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 8,
            background: '#1e1e2e',
            border: '1px solid #333',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            minWidth: 120,
          }}
        >
          <div className="font-semibold mb-0.5">{tooltip.name}</div>
          {tooltip.value != null && (
            <div style={{ color }} className="text-sm font-bold">
              {formatCircleValue(tooltip.value)} <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
            </div>
          )}
        </div>
      )}

      <ComposableMap
        projectionConfig={{ scale: 145, center: [0, 10] }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const entry = seriesMap[geo.id]
                const fill = entry ? getCountryColor(entry.value, maxVal, color) : '#1e1e2e'
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#2a2a3e"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: color, fillOpacity: 0.85, outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseMove={e => {
                      const rect = e.currentTarget.closest('svg')?.getBoundingClientRect()
                      const svgParent = e.currentTarget.closest('.relative')?.getBoundingClientRect()
                      const x = e.clientX - (svgParent?.left ?? 0)
                      const y = e.clientY - (svgParent?.top ?? 0)
                      setTooltip({
                        x,
                        y,
                        name: entry?.name ?? geo.properties?.name ?? geo.id,
                        value: entry?.value ?? null,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
