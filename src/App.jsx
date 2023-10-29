import { useEffect, useMemo, useState } from 'react'
import viteLogo from '/vite.svg'
import axios from 'axios';
import Header from './components/Header';
import Layout from './Layout';
import { Switch } from '@headlessui/react';
import ElectricityIcon from './assets/ElectricityIcon';
import OilIcon from './assets/OilIcon';
import NuklearIcon from './assets/NuclearIcon';
import GreenEnergyIcon from './assets/GreenEnergyIcon';
import Pagination from './components/Pagination';
import Chart from './assets/Chart';
import WorldMap from './assets/WorldMap';

const pages = [
  {name: 'Oil', icon: <OilIcon />},
  {name: 'Nuclear', icon: <NuklearIcon />},
  {name: 'Electricity', icon: <ElectricityIcon />},
  {name: 'Green Energy', icon: <GreenEnergyIcon />},
]

const colorMode = {
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-black', selectedClass: 'ring-gray-900' },
  ]
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const BRENT_DAILY = 'https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=daily&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

const WTI_DAILY = 'https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

const WORLD_ANNUAL_OIL_API = 'https://api.eia.gov/v2/international/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=annual&data[0]=value&facets[activityId][]=1&facets[productId][]=53&facets[countryRegionId][]=WORL&facets[unit][]=TBPD&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

const WORLD_OIL_PRODUCTION_CONSUPTION = 'https://api.eia.gov/v2/international/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=annual&data[0]=value&facets[activityId][]=1&facets[activityId][]=2&facets[activityId][]=23&facets[activityId][]=3&facets[activityId][]=34&facets[activityId][]=4&facets[activityId][]=6&facets[activityId][]=8&facets[productId][]=4006&facets[productId][]=4415&facets[productId][]=5&facets[productId][]=53&start=2020&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

const COUNTRIES_ANNUAL_OIL_PRODUCTION = 'https://api.eia.gov/v2/international/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=annual&data[0]=value&facets[activityId][]=1&facets[productId][]=4415&facets[countryRegionId][]=ABW&facets[countryRegionId][]=AFG&facets[countryRegionId][]=AGO&facets[countryRegionId][]=ALB&facets[countryRegionId][]=ARE&facets[countryRegionId][]=ARG&facets[countryRegionId][]=ARM&facets[countryRegionId][]=ASM&facets[countryRegionId][]=ATA&facets[countryRegionId][]=ATG&facets[countryRegionId][]=AUS&facets[countryRegionId][]=AUT&facets[countryRegionId][]=AZE&facets[countryRegionId][]=BDI&facets[countryRegionId][]=BEL&facets[countryRegionId][]=BEN&facets[countryRegionId][]=BFA&facets[countryRegionId][]=BGD&facets[countryRegionId][]=BGR&facets[countryRegionId][]=BHR&facets[countryRegionId][]=BHS&facets[countryRegionId][]=BIH&facets[countryRegionId][]=BLR&facets[countryRegionId][]=BLZ&facets[countryRegionId][]=BMU&facets[countryRegionId][]=BOL&facets[countryRegionId][]=BRA&facets[countryRegionId][]=BRB&facets[countryRegionId][]=BRN&facets[countryRegionId][]=BTN&facets[countryRegionId][]=BWA&facets[countryRegionId][]=CAF&facets[countryRegionId][]=CAN&facets[countryRegionId][]=CHE&facets[countryRegionId][]=CHL&facets[countryRegionId][]=CHN&facets[countryRegionId][]=CIV&facets[countryRegionId][]=CMR&facets[countryRegionId][]=COD&facets[countryRegionId][]=COG&facets[countryRegionId][]=COK&facets[countryRegionId][]=COL&facets[countryRegionId][]=COM&facets[countryRegionId][]=CPV&facets[countryRegionId][]=CRI&facets[countryRegionId][]=CUB&facets[countryRegionId][]=CYM&facets[countryRegionId][]=CYP&facets[countryRegionId][]=CZE&facets[countryRegionId][]=DEU&facets[countryRegionId][]=DJI&facets[countryRegionId][]=DMA&facets[countryRegionId][]=DNK&facets[countryRegionId][]=DOM&facets[countryRegionId][]=DZA&facets[countryRegionId][]=ECU&facets[countryRegionId][]=EGY&facets[countryRegionId][]=ERI&facets[countryRegionId][]=ESP&facets[countryRegionId][]=EST&facets[countryRegionId][]=ETH&facets[countryRegionId][]=FIN&facets[countryRegionId][]=FJI&facets[countryRegionId][]=FLK&facets[countryRegionId][]=FRA&facets[countryRegionId][]=FRO&facets[countryRegionId][]=FSM&facets[countryRegionId][]=GAB&facets[countryRegionId][]=GBR&facets[countryRegionId][]=GBRO&facets[countryRegionId][]=GEO&facets[countryRegionId][]=GHA&facets[countryRegionId][]=GIB&facets[countryRegionId][]=GIN&facets[countryRegionId][]=GLP&facets[countryRegionId][]=GMB&facets[countryRegionId][]=GNB&facets[countryRegionId][]=GNQ&facets[countryRegionId][]=GRC&facets[countryRegionId][]=GRD&facets[countryRegionId][]=GRL&facets[countryRegionId][]=GTM&facets[countryRegionId][]=GUF&facets[countryRegionId][]=GUM&facets[countryRegionId][]=GUY&facets[countryRegionId][]=HITZ&facets[countryRegionId][]=HKG&facets[countryRegionId][]=HND&facets[countryRegionId][]=HRV&facets[countryRegionId][]=HTI&facets[countryRegionId][]=HUN&facets[countryRegionId][]=IDN&facets[countryRegionId][]=IND&facets[countryRegionId][]=IRL&facets[countryRegionId][]=IRN&facets[countryRegionId][]=IRQ&facets[countryRegionId][]=ISL&facets[countryRegionId][]=ISR&facets[countryRegionId][]=ITA&facets[countryRegionId][]=JAM&facets[countryRegionId][]=JOR&facets[countryRegionId][]=JPN&facets[countryRegionId][]=KAZ&facets[countryRegionId][]=KEN&facets[countryRegionId][]=KGZ&facets[countryRegionId][]=KHM&facets[countryRegionId][]=KIR&facets[countryRegionId][]=KNA&facets[countryRegionId][]=KOR&facets[countryRegionId][]=KWT&facets[countryRegionId][]=LAO&facets[countryRegionId][]=LBN&facets[countryRegionId][]=LBR&facets[countryRegionId][]=LBY&facets[countryRegionId][]=LCA&facets[countryRegionId][]=LKA&facets[countryRegionId][]=LSO&facets[countryRegionId][]=LTU&facets[countryRegionId][]=LUX&facets[countryRegionId][]=LVA&facets[countryRegionId][]=MAC&facets[countryRegionId][]=MAR&facets[countryRegionId][]=MDA&facets[countryRegionId][]=MDG&facets[countryRegionId][]=MDV&facets[countryRegionId][]=MEX&facets[countryRegionId][]=MIDE&facets[countryRegionId][]=MKD&facets[countryRegionId][]=MLI&facets[countryRegionId][]=MLT&facets[countryRegionId][]=MMR&facets[countryRegionId][]=MNE&facets[countryRegionId][]=MNG&facets[countryRegionId][]=MNP&facets[countryRegionId][]=MOZ&facets[countryRegionId][]=MRT&facets[countryRegionId][]=MSR&facets[countryRegionId][]=MTQ&facets[countryRegionId][]=MUS&facets[countryRegionId][]=MWI&facets[countryRegionId][]=MYS&facets[countryRegionId][]=NAM&facets[countryRegionId][]=NCL&facets[countryRegionId][]=NER&facets[countryRegionId][]=NGA&facets[countryRegionId][]=NIC&facets[countryRegionId][]=NIU&facets[countryRegionId][]=NLD&facets[countryRegionId][]=NLDA&facets[countryRegionId][]=NOR&facets[countryRegionId][]=NPL&facets[countryRegionId][]=NRU&facets[countryRegionId][]=NZL&facets[countryRegionId][]=OMN&facets[countryRegionId][]=PAK&facets[countryRegionId][]=PAN&facets[countryRegionId][]=PER&facets[countryRegionId][]=PHL&facets[countryRegionId][]=PNG&facets[countryRegionId][]=POL&facets[countryRegionId][]=PRI&facets[countryRegionId][]=PRK&facets[countryRegionId][]=PRT&facets[countryRegionId][]=PRY&facets[countryRegionId][]=PSE&facets[countryRegionId][]=PYF&facets[countryRegionId][]=QAT&facets[countryRegionId][]=ROU&facets[countryRegionId][]=RUS&facets[countryRegionId][]=RWA&facets[countryRegionId][]=SAU&facets[countryRegionId][]=SDN&facets[countryRegionId][]=SEN&facets[countryRegionId][]=SGP&facets[countryRegionId][]=SHN&facets[countryRegionId][]=SLB&facets[countryRegionId][]=SLE&facets[countryRegionId][]=SLV&facets[countryRegionId][]=SOM&facets[countryRegionId][]=SPM&facets[countryRegionId][]=SRB&facets[countryRegionId][]=SSD&facets[countryRegionId][]=STP&facets[countryRegionId][]=SUR&facets[countryRegionId][]=SVK&facets[countryRegionId][]=SVN&facets[countryRegionId][]=SWE&facets[countryRegionId][]=SWZ&facets[countryRegionId][]=SYC&facets[countryRegionId][]=SYR&facets[countryRegionId][]=TCA&facets[countryRegionId][]=TCD&facets[countryRegionId][]=TGO&facets[countryRegionId][]=THA&facets[countryRegionId][]=TJK&facets[countryRegionId][]=TKM&facets[countryRegionId][]=TLS&facets[countryRegionId][]=TON&facets[countryRegionId][]=TTO&facets[countryRegionId][]=TUN&facets[countryRegionId][]=TUR&facets[countryRegionId][]=TUV&facets[countryRegionId][]=TWN&facets[countryRegionId][]=TZA&facets[countryRegionId][]=UGA&facets[countryRegionId][]=UKR&facets[countryRegionId][]=URY&facets[countryRegionId][]=USA&facets[countryRegionId][]=UZB&facets[countryRegionId][]=VCT&facets[countryRegionId][]=VEN&facets[countryRegionId][]=VGB&facets[countryRegionId][]=VIR&facets[countryRegionId][]=VNM&facets[countryRegionId][]=VUT&facets[countryRegionId][]=WAK&facets[countryRegionId][]=WP13&facets[countryRegionId][]=WP14&facets[countryRegionId][]=WP15&facets[countryRegionId][]=WP16&facets[countryRegionId][]=WP17&facets[countryRegionId][]=WP25&facets[countryRegionId][]=WP27&facets[countryRegionId][]=WSM&facets[countryRegionId][]=XKS&facets[countryRegionId][]=YEM&facets[countryRegionId][]=ZAF&facets[countryRegionId][]=ZMB&facets[countryRegionId][]=ZWE&facets[unit][]=QBTU&start=2010&end=2023&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

const COUNTRIES_ANNUAL_OIL_CONSUMPTION = 'https://api.eia.gov/v2/international/data/?api_key=c10de4f134f66672b5c80ff6c0eda8c4&frequency=annual&data[0]=value&facets[activityId][]=2&facets[productId][]=4415&facets[countryRegionId][]=ABW&facets[countryRegionId][]=AFG&facets[countryRegionId][]=AGO&facets[countryRegionId][]=ALB&facets[countryRegionId][]=ARE&facets[countryRegionId][]=ARG&facets[countryRegionId][]=ARM&facets[countryRegionId][]=ASM&facets[countryRegionId][]=ATA&facets[countryRegionId][]=ATG&facets[countryRegionId][]=AUS&facets[countryRegionId][]=AUT&facets[countryRegionId][]=AZE&facets[countryRegionId][]=BDI&facets[countryRegionId][]=BEL&facets[countryRegionId][]=BEN&facets[countryRegionId][]=BFA&facets[countryRegionId][]=BGD&facets[countryRegionId][]=BGR&facets[countryRegionId][]=BHR&facets[countryRegionId][]=BHS&facets[countryRegionId][]=BIH&facets[countryRegionId][]=BLR&facets[countryRegionId][]=BLZ&facets[countryRegionId][]=BMU&facets[countryRegionId][]=BOL&facets[countryRegionId][]=BRA&facets[countryRegionId][]=BRB&facets[countryRegionId][]=BRN&facets[countryRegionId][]=BTN&facets[countryRegionId][]=BWA&facets[countryRegionId][]=CAN&facets[countryRegionId][]=CHE&facets[countryRegionId][]=CHL&facets[countryRegionId][]=CHN&facets[countryRegionId][]=CIV&facets[countryRegionId][]=CMR&facets[countryRegionId][]=COD&facets[countryRegionId][]=COG&facets[countryRegionId][]=COK&facets[countryRegionId][]=COL&facets[countryRegionId][]=COM&facets[countryRegionId][]=CPV&facets[countryRegionId][]=CRI&facets[countryRegionId][]=CSK&facets[countryRegionId][]=CUB&facets[countryRegionId][]=CYM&facets[countryRegionId][]=CYP&facets[countryRegionId][]=CZE&facets[countryRegionId][]=DDR&facets[countryRegionId][]=DEU&facets[countryRegionId][]=DEUO&facets[countryRegionId][]=DEUW&facets[countryRegionId][]=DJI&facets[countryRegionId][]=DMA&facets[countryRegionId][]=DNK&facets[countryRegionId][]=DOM&facets[countryRegionId][]=DZA&facets[countryRegionId][]=ECU&facets[countryRegionId][]=EGY&facets[countryRegionId][]=ERI&facets[countryRegionId][]=ESH&facets[countryRegionId][]=ESP&facets[countryRegionId][]=EST&facets[countryRegionId][]=ETH&facets[countryRegionId][]=FIN&facets[countryRegionId][]=FJI&facets[countryRegionId][]=FLK&facets[countryRegionId][]=FRA&facets[countryRegionId][]=FRO&facets[countryRegionId][]=FSM&facets[countryRegionId][]=GAB&facets[countryRegionId][]=GBR&facets[countryRegionId][]=GBRO&facets[countryRegionId][]=GEO&facets[countryRegionId][]=GHA&facets[countryRegionId][]=GIB&facets[countryRegionId][]=GIN&facets[countryRegionId][]=GLP&facets[countryRegionId][]=GMB&facets[countryRegionId][]=GNB&facets[countryRegionId][]=GNQ&facets[countryRegionId][]=GRC&facets[countryRegionId][]=GRD&facets[countryRegionId][]=GRL&facets[countryRegionId][]=GTM&facets[countryRegionId][]=GUF&facets[countryRegionId][]=GUM&facets[countryRegionId][]=GUY&facets[countryRegionId][]=HITZ&facets[countryRegionId][]=HKG&facets[countryRegionId][]=HND&facets[countryRegionId][]=HRV&facets[countryRegionId][]=HTI&facets[countryRegionId][]=HUN&facets[countryRegionId][]=IDN&facets[countryRegionId][]=IND&facets[countryRegionId][]=IRL&facets[countryRegionId][]=IRN&facets[countryRegionId][]=IRQ&facets[countryRegionId][]=ISL&facets[countryRegionId][]=ISR&facets[countryRegionId][]=ITA&facets[countryRegionId][]=JAM&facets[countryRegionId][]=JOR&facets[countryRegionId][]=JPN&facets[countryRegionId][]=KAZ&facets[countryRegionId][]=KEN&facets[countryRegionId][]=KGZ&facets[countryRegionId][]=KHM&facets[countryRegionId][]=KIR&facets[countryRegionId][]=KNA&facets[countryRegionId][]=KOR&facets[countryRegionId][]=KWT&facets[countryRegionId][]=LAO&facets[countryRegionId][]=LBN&facets[countryRegionId][]=LBR&facets[countryRegionId][]=LBY&facets[countryRegionId][]=LCA&facets[countryRegionId][]=LKA&facets[countryRegionId][]=LSO&facets[countryRegionId][]=LTU&facets[countryRegionId][]=LUX&facets[countryRegionId][]=LVA&facets[countryRegionId][]=MAC&facets[countryRegionId][]=MAR&facets[countryRegionId][]=MDA&facets[countryRegionId][]=MDG&facets[countryRegionId][]=MDV&facets[countryRegionId][]=MEX&facets[countryRegionId][]=MIDE&facets[countryRegionId][]=MKD&facets[countryRegionId][]=MLI&facets[countryRegionId][]=MLT&facets[countryRegionId][]=MMR&facets[countryRegionId][]=MNE&facets[countryRegionId][]=MNG&facets[countryRegionId][]=MNP&facets[countryRegionId][]=MOZ&facets[countryRegionId][]=MRT&facets[countryRegionId][]=MSR&facets[countryRegionId][]=MTQ&facets[countryRegionId][]=MUS&facets[countryRegionId][]=MWI&facets[countryRegionId][]=MYS&facets[countryRegionId][]=NAM&facets[countryRegionId][]=NCL&facets[countryRegionId][]=NER&facets[countryRegionId][]=NGA&facets[countryRegionId][]=NIC&facets[countryRegionId][]=NIU&facets[countryRegionId][]=NLD&facets[countryRegionId][]=NLDA&facets[countryRegionId][]=NLDO&facets[countryRegionId][]=NOEC&facets[countryRegionId][]=NOR&facets[countryRegionId][]=NPL&facets[countryRegionId][]=NRU&facets[countryRegionId][]=NZL&facets[countryRegionId][]=OECD&facets[countryRegionId][]=OMN&facets[countryRegionId][]=PAK&facets[countryRegionId][]=PAN&facets[countryRegionId][]=PER&facets[countryRegionId][]=PERG&facets[countryRegionId][]=PHL&facets[countryRegionId][]=PNG&facets[countryRegionId][]=POL&facets[countryRegionId][]=PRI&facets[countryRegionId][]=PRK&facets[countryRegionId][]=PRT&facets[countryRegionId][]=PRY&facets[countryRegionId][]=PSE&facets[countryRegionId][]=PYF&facets[countryRegionId][]=QAT&facets[countryRegionId][]=REU&facets[countryRegionId][]=ROU&facets[countryRegionId][]=RUS&facets[countryRegionId][]=RWA&facets[countryRegionId][]=SAU&facets[countryRegionId][]=SCG&facets[countryRegionId][]=SDN&facets[countryRegionId][]=SEN&facets[countryRegionId][]=SGP&facets[countryRegionId][]=SHN&facets[countryRegionId][]=SLB&facets[countryRegionId][]=SLE&facets[countryRegionId][]=SLV&facets[countryRegionId][]=SOM&facets[countryRegionId][]=SPM&facets[countryRegionId][]=SRB&facets[countryRegionId][]=SSD&facets[countryRegionId][]=STP&facets[countryRegionId][]=SUN&facets[countryRegionId][]=SUR&facets[countryRegionId][]=SVK&facets[countryRegionId][]=SVN&facets[countryRegionId][]=SWE&facets[countryRegionId][]=SWZ&facets[countryRegionId][]=SYC&facets[countryRegionId][]=SYR&facets[countryRegionId][]=TCA&facets[countryRegionId][]=TCD&facets[countryRegionId][]=TGO&facets[countryRegionId][]=THA&facets[countryRegionId][]=TJK&facets[countryRegionId][]=TKM&facets[countryRegionId][]=TLS&facets[countryRegionId][]=TON&facets[countryRegionId][]=TTO&facets[countryRegionId][]=TUN&facets[countryRegionId][]=TUR&facets[countryRegionId][]=TUV&facets[countryRegionId][]=TWN&facets[countryRegionId][]=TZA&facets[countryRegionId][]=UGA&facets[countryRegionId][]=UKR&facets[countryRegionId][]=URY&facets[countryRegionId][]=USA&facets[countryRegionId][]=USIQ&facets[countryRegionId][]=USOH&facets[countryRegionId][]=UZB&facets[countryRegionId][]=VCT&facets[countryRegionId][]=VEN&facets[countryRegionId][]=VGB&facets[countryRegionId][]=VIR&facets[countryRegionId][]=VNM&facets[countryRegionId][]=VUT&facets[countryRegionId][]=WAK&facets[countryRegionId][]=WORL&facets[countryRegionId][]=WP13&facets[countryRegionId][]=WP14&facets[countryRegionId][]=WP15&facets[countryRegionId][]=WP16&facets[countryRegionId][]=WP17&facets[countryRegionId][]=WP19&facets[countryRegionId][]=WP25&facets[countryRegionId][]=WP27&facets[countryRegionId][]=WSM&facets[countryRegionId][]=XKS&facets[countryRegionId][]=YEM&facets[countryRegionId][]=YUG&facets[countryRegionId][]=ZMB&facets[countryRegionId][]=ZWE&start=2010&end=2023&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  const [loading, setLoadin] = useState(true);
  const [dataProductions, setDataProductions] = useState([]);
  const [dataConsumptions, setDataConsumptions] = useState([]);
  const [wti, setWti] = useState([]);
  const [brent, setBrent] = useState([]);
  const [worldProduction, setWorldProduction] = useState([]);
  const [worldConsumption, setWorldConsumption] = useState([]);
  const [selectedColor, setSelectedColor] = useState(colorMode.colors[0])
  const [agreed, setAgreed] = useState(false)
  const [active, setActive] = useState(0)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('value');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Top three Productions
  const maxYearByCountryProductions = {};
  dataProductions.forEach(item => {
      if (!maxYearByCountryProductions[item.countryRegionName] || item.period > maxYearByCountryProductions[item.countryRegionName]) {
        maxYearByCountryProductions[item.countryRegionName] = item.period;
      }
  });

// Determine the maximum year globally
const maxYearProductions = Math.max(...Object.values(maxYearByCountryProductions));

// Filter data for the maximum year
const lastYearDataProductions = dataProductions.filter(item => item.period === maxYearProductions);

// Sort the filtered data by productionValue in descending order
lastYearDataProductions.sort((a, b) => {
  const valueA = a.value || 0; // Use 0 if value is undefined or NaN
  const valueB = b.value || 0; // Use 0 if value is undefined or NaN
  return valueB - valueA;
});

// Select the top three countries
const topThreeCountriesProductions = lastYearDataProductions.slice(0, 3);

// Top three Consumptions
const maxYearByCountryConsumptions = {};
dataConsumptions.forEach(item => {
  maxYearByCountryConsumptions[item.countryRegionName] = -Infinity;
  });
  dataConsumptions.forEach(item => {
      if (!maxYearByCountryConsumptions[item.countryRegionName] || item.period > maxYearByCountryConsumptions[item.countryRegionName]) {
        maxYearByCountryConsumptions[item.countryRegionName] = item.period;
      }
  });

// Determine the maximum year globally
const maxYearConsumptions = Math.max(...Object.values(maxYearByCountryConsumptions));

// Filter data for the maximum year
const lastYearDataConsumptions = dataConsumptions.filter(item => item.period === maxYearConsumptions);

// Sort the filtered data by productionValue in descending order
lastYearDataConsumptions.sort((a, b) => {
  const valueA = a.value || 0; // Use 0 if value is undefined or NaN
  const valueB = b.value || 0; // Use 0 if value is undefined or NaN
  return valueB - valueA;
});

// Select the top three countries
const topThreeCountriesConsumptions = lastYearDataConsumptions.slice(0, 3);

// the largest production on a day of the year worldConsumption
const maxYearByWorldProduction = {};
worldProduction.forEach(item => {
  maxYearByWorldProduction[item.countryRegionName] = -Infinity;
});
worldProduction.forEach(item => {
    if (!maxYearByWorldProduction[item.countryRegionName] || item.period > maxYearByWorldProduction[item.countryRegionName]) {
      maxYearByWorldProduction[item.countryRegionName] = item.period;
    }
  });

// Determine the maximum year globally
const maxYearWorldProduction = Math.max(...Object.values(maxYearByWorldProduction));

// Filter data for the maximum year
const lastYearWorldProduction = worldProduction.filter(item => item.period === maxYearWorldProduction);

// Sort the filtered data by productionValue in descending order
lastYearWorldProduction.sort((a, b) => b.value - a.value);

// Select the top three countries
const lastWorldProduction = lastYearWorldProduction.slice(0, 1);

// the largest Consumption on a day of the year 
const maxYearByWorldConsumption = {};
worldConsumption.forEach(item => {
  maxYearByWorldConsumption[item?.countryRegionName] = -Infinity;
});
worldConsumption?.forEach(item => {
    if (!maxYearByWorldConsumption[item?.countryRegionName] || item?.period > maxYearByWorldConsumption[item?.countryRegionName]) {
      maxYearByWorldConsumption[item?.countryRegionName] = item?.period;
    }
  });

// Determine the maximum year globally
const maxYearWorldConsumption = Math.max(...Object.values(maxYearByWorldConsumption));

// Filter data for the maximum year
const lastYearWorldConsumption = worldConsumption?.filter(item => item?.period === maxYearWorldConsumption);

// Sort the filtered data by productionValue in descending order
lastYearWorldConsumption.sort((a, b) => {
  const valueA = a.value || 0; // Use 0 if value is undefined or NaN
  const valueB = b.value || 0; // Use 0 if value is undefined or NaN
  return valueB - valueA;
});

// Select the top three countries
const lastWorldConsumption = lastYearWorldConsumption?.slice(0, 1);

  const visibleConsuptionsRows = useMemo(
    () =>
      stableSort(dataConsumptions, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, dataConsumptions],
  );

  const visibleProductionsRows = useMemo(
    () =>
      stableSort(dataProductions, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, dataProductions],
  );

  useEffect(() => {
    const fetchData = async () => {
      const consumptionResponse = await axios.get(COUNTRIES_ANNUAL_OIL_CONSUMPTION);
      const productionResponse = await axios.get(COUNTRIES_ANNUAL_OIL_PRODUCTION);
      const wtiResponse = await axios.get(WTI_DAILY);
      const brentResponse = await axios.get(BRENT_DAILY);
      const worldProductionConsumptionResponse = await axios.get(WORLD_OIL_PRODUCTION_CONSUPTION)
  
      setDataConsumptions(consumptionResponse.data.response.data.filter(item => item.countryRegionTypeId === 'c'));
      setDataProductions(productionResponse.data.response.data.filter(item => item.countryRegionTypeId === 'c'));
      setWorldProduction(worldProductionConsumptionResponse.data.response.data.filter(item => item.activityName === 'Production'))
      setWorldConsumption(worldProductionConsumptionResponse.data.response.data.filter(item => item.activityName === 'Consumption'))
      setWti(wtiResponse.data.response.data)
      setBrent(brentResponse.data.response.data)
  
      setLoadin(false); // Assuming this is used to control loading state.
    };
  
    fetchData();
  }, []);

  useEffect(() => {

    localStorage.setItem('theme', theme)

    if (theme === 'dark' || localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  function handleThemeMode() {
    setTheme(theme !== 'dark' ? 'dark' : 'light')
  }

  return (
    <div className='dark:bg-black'>
      <Header
       colorMode={colorMode}
       handleThemeMode={handleThemeMode}
       setSelectedColor={setSelectedColor}
       selectedColor={selectedColor}
      />
      {
        loading ?
        <div className='absolute left-0 top-0 h-full w-full bg-black flex items-center justify-center flex-col'>
          <div className="flex flex-shrink-0 items-center">
            <svg width="100" height="60" viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.5 12.3623C10.2832 13.3843 8.71387 14 7 14C3.13379 14 0 10.8662 0 7C0 3.13379 3.13379 0 7 0C8.71387 0 10.2832 0.615723 11.5 1.6377C12.7168 0.615723 14.2861 0 16 0C19.8662 0 23 3.13379 23 7C23 10.8662 19.8662 14 16 14C14.2861 14 12.7168 13.3843 11.5 12.3623ZM5.68951 3.39838C5.30844 3.61838 5.17788 4.10565 5.39789 4.48671L8.70376 10.2126C8.77042 10.3281 8.86162 10.4206 8.96696 10.4873C9.0246 10.5552 9.09472 10.6146 9.17633 10.6617C9.55739 10.8817 10.0447 10.7511 10.2647 10.3701L11.7207 7.84807L13.828 9.95531C13.8655 9.99282 13.9058 10.0258 13.9483 10.0543C13.9849 10.0856 14.025 10.1141 14.0683 10.1391C14.4494 10.3591 14.9367 10.2285 15.1567 9.84748L18.0667 4.80721C18.2867 4.42614 18.1561 3.93888 17.7751 3.71887C17.394 3.49886 16.9067 3.62943 16.6867 4.01049L14.2892 8.16309L12.4267 6.30053C12.3181 6.19197 12.186 6.12129 12.0468 6.08849C11.9998 6.04243 11.9464 6.00148 11.8868 5.96707C11.5057 5.74706 11.0184 5.87762 10.7984 6.25868L9.52966 8.45628L6.77784 3.69C6.55784 3.30893 6.07057 3.17837 5.68951 3.39838Z" fill="#20F3C7"/>
            </svg>
          </div>
          <p className='text-neon-green font-semibold text-7xl py-4'>Worldwide</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
        :
        <div>
          <div className="bg-white dark:bg-black pt-20">
            <section className='py-16'>
              <div className='px-16 pt-8 pb-16 shadow-xl mx-16 rounded-2xl flex justify-center items-center flex-col'>
                <div className='flex items-start'>
                  <Switch
                    checked={agreed}
                    onChange={setAgreed}
                    className={classNames(
                      'bg-grey-light dark:bg-black flex items-center w-40 h-7 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-light transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green shadow-lg mb-12'
                    )}
                  >
                    <span
                      className={classNames(
                        agreed ? 'translate-x-20' : 'translate-x-0',
                        'h-6 w-20 transform rounded-full bg-black dark:bg-white ring-inset ring-1 transition duration-200 ease-in-out text-xs flex justify-center items-center text-neon-green dark:text-black'
                      )}
                    >
                      {agreed ? 'Production' : 'Consuption'}
                    </span>
                    <span
                      className={classNames(
                        !agreed ? 'translate-x-0' : '-translate-x-20',
                        'h-6 w-20 transform text-xs flex justify-center items-center text-gray-light ring-inset'
                      )}
                    >
                      {!agreed ? 'Production' : 'Consuption'}
                    </span>
                  </Switch>
                </div>
                <div>
                  <h1 className='text-4xl font-bold dark:text-white pb-8'>Worldwide Oil {!agreed ? 'Consumption' : 'Production'}</h1>
                </div>
                {
                  !agreed ?
                  <div className='rounded-full w-48 h-48 bg-neon-green flex justify-center items-center flex-col'>
                    <span className='-mt-6 text-xs'>
                      {lastWorldConsumption?.slice(0, 1).map(item => item?.period)}{' last year'}
                    </span>
                    <span className='text-6xl font-bold'>
                      {
                        lastWorldConsumption?.map(item => item?.value && Math.floor(item?.value / 1000))
                      }
                    </span>
                    <span className='text-sm -mb-8 mx-8 text-center font-bold'>
                      {
                        lastWorldConsumption?.map(item => item?.unitName === "1000 metric tons" ? 'million metric tons' : "1000 metric tons")
                      }
                    </span>
                  </div>
                  :
                  <div className='rounded-full w-48 h-48 bg-neon-green flex justify-center items-center flex-col'>
                    <span className='-mt-6 text-xs'>
                      {lastWorldProduction.slice(0, 1).map(item => item.period)}{' last year'}
                    </span>
                    <span className='text-6xl font-bold'>
                      {
                        lastWorldProduction.map(item => Math.floor(item.value / 1000))
                      }
                    </span>
                    <span className='text-sm -mb-8 mx-8 text-center font-bold'>
                      {
                        lastWorldProduction.map(item => item.unitName === "thousand barrels per day" ? 'million barrels per day' : "thousand barrels per day")
                      }
                    </span>
                  </div>

                }
                <div className='pages flex justify-between w-72 -mb-8 mt-8'>
                  {
                    pages?.map((item, index) => (
                      <div key={item.name} className='flex items-center justify-start'>
                        <a href="#" className={`${active == index && 'border-b border-neon-green border-b-4 pb-1'}`}>
                          {item.icon}
                        </a>
                        <div className={`flex-auto ml-1 min-w-full h-1 bg-white ${pages.length - 1 === index && 'hidden'}`}></div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </section>
            {
              <section className='py-4'>
                <div className='px-16 pt-8 pb-16 shadow-xl mx-16 rounded-2xl flex justify-around items-center'>
                  <div className='flex justify-around flex-1'>
                    <div id='brent-container'>
                      <Chart id="brent" valuesBrent={brent} />
                    </div>
                    <div>
                      <h3 className='text-3xl dark:text-white font-bold text-center pb-8'>
                        Brent
                      </h3>
                      <div className='p-2'>
                        <dt className="text-base text-center dark:text-white leading-7 text-gray-600">
                          {brent.slice(0, 1).map(item => item.period)}
                        </dt>
                        <span className='text-4xl dark:text-white font-bold'>
                          {'$'}{brent.slice(0, 1).map(item => item.value)}
                        </span>
                      </div>
                      <div className='text-center'>
                        <small className='dark:text-white font-bold text-center'>
                          {brent.slice(0, 1).map(item => item.units)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className='divide-x divide-white flex'>
                    <div className='w-1 h-40'>
                    </div>
                    <div className='w-1 h-40'>
                    </div>
                  </div>
                  <div className='flex justify-around flex-1'>
                    <div>
                      <h3 className='text-3xl dark:text-white font-bold text-center pb-8'>
                        WTI
                      </h3>
                      <div className='p-2'>
                        <dt className="text-base text-center dark:text-white leading-7 text-gray-600">
                          {wti.slice(0, 1).map(item => item.period)}
                        </dt>
                        <span className='text-4xl dark:text-white font-bold'>
                          {'$'}{wti.slice(0, 1).map(item => item.value)}
                        </span>
                      </div>
                      <div className='text-center'>
                        <small className='dark:text-white font-bold text-center'>
                          {wti.slice(0, 1).map(item => item.units)}
                        </small>
                      </div>
                    </div>
                    <div>
                      <Chart id="wti" valuesWti={wti} />
                    </div>
                  </div>
                </div>
              </section>
            }
            <section className='py-16 lg:container overflow-hidden mx-auto fullWidht world-map overglow-hidden relative'>
              <WorldMap width={"100%"} data={agreed ? worldConsumption: worldProduction} />
            </section>
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            {
              <h2 className='text-3xl dark:text-white font-bold mb-8 text-center'>
                {' Top 3 Oil '}
                {
                agreed ? dataProductions.slice(0, 1).map(stat => stat?.activityName) : dataConsumptions.slice(0, 1).map(stat => stat?.activityName)
                }
              </h2>
            }
            <div className='flex items-start'>
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  'bg-grey-light dark:bg-black flex items-center w-40 h-7 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-light transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green shadow-lg mb-12'
                )}
              >
                <span
                  className={classNames(
                    agreed ? 'translate-x-20' : 'translate-x-0',
                    'h-6 w-20 transform rounded-full bg-black dark:bg-white ring-inset ring-1 transition duration-200 ease-in-out text-xs flex justify-center items-center text-neon-green dark:text-black'
                  )}
                >
                  {agreed ? 'Production' : 'Consuption'}
                </span>
                <span
                  className={classNames(
                    !agreed ? 'translate-x-0' : '-translate-x-20',
                    'h-6 w-20 transform text-xs flex justify-center items-center text-gray-light ring-inset'
                  )}
                >
                  {!agreed ? 'Production' : 'Consuption'}
                </span>
              </Switch>
            </div>
              {
                !agreed ?
                <dl className="grid dark:text-white grid-cols-1 gap-x-8 gap-y-8 text-center lg:grid-cols-3">
                  {topThreeCountriesConsumptions.map((stat) => (
                    <div key={stat?.value} className="mx-auto flex max-w-xs flex-col gap-y-4">
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        {stat?.countryRegionName}
                      </dd>
                    </div>
                  ))}
                  {topThreeCountriesConsumptions.map((stat) => (
                    <div key={stat?.value + stat?.countryRegionId} className="mx-auto flex max-w-xs flex-col gap-y-4">
                      <dt className="text-base leading-7 text-gray-600">{stat?.unitName}</dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        {stat.value > 0 ? stat?.value.toFixed(2) : stat?.value}
                      </dd>
                    </div>
                  ))}
                  {topThreeCountriesConsumptions.map((stat) => (
                    <div key={stat?.value} className="mx-auto flex max-w-xs flex-col gap-y-4">
                      <dt className="text-base leading-7 text-gray-600">Last Year</dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        {stat?.period}
                      </dd>
                    </div>
                  ))}
                </dl>
                :
                <dl className="grid dark:text-white grid-cols-1 gap-x-8 gap-y-8 text-center lg:grid-cols-3">
                {topThreeCountriesProductions.map((stat) => (
                  <div key={stat?.value} className="mx-auto flex max-w-xs flex-col gap-y-4">
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                      {stat?.countryRegionName}
                    </dd>
                  </div>
                ))}
                {topThreeCountriesProductions.map((stat) => (
                  <div key={stat?.value + stat?.countryRegionId} className="mx-auto flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">{stat?.unitName}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                      {stat.value > 0 ? stat?.value.toFixed(2) : stat?.value}
                    </dd>
                  </div>
                ))}
                {topThreeCountriesProductions.map((stat) => (
                  <div key={stat?.value} className="mx-auto flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Last Year</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                      {stat?.period}
                    </dd>
                  </div>
                ))}
              </dl>
              }
            </div>
          </div>
          <div className='mx-8 pb-8 pt-16'>
            <h2 className='text-2xl dark:text-white font-bold'>{agreed ? 'Production Oil quadrillion Btu' : 'Consuption Oil quadrillion Btu'}</h2>
            <div className='w-100 h-2 border-b dark:text-white'></div>
          </div>
          <div className='flex flex-wrap fullWidth'>
            <div className='flex-1'>
              {
                agreed ?
                <div>
                  <table className="table-auto dark:text-white border-separate border-spacing-8 w-full">
                    <thead className='text-left'>
                      <tr>
                        <th className='py-4'>Country</th>
                        <th className='text-right'>Value</th>
                      </tr>
                    </thead>
                    <tbody className='px-6'>
                    {
                    visibleProductionsRows.map((item, index) => (
                      <tr className='hover:shadow-xl rounded-xl' key={index + '_' + item.countryRegionId}>
                        <td className='px-6 py-2'>{item.countryRegionName}</td>
                        <td className='px-6 text-right'>{item.value}</td>
                      </tr>
                    ))
                    }
                    </tbody>
                  </table>
                  {
                    agreed &&
                    <Pagination page={page} setPage={setPage} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} results={dataProductions.length} />
                  }
                </div>
                :
                <div>
                  <table className="table-auto w-full dark:text-white border-separate border-spacing-8">
                    <thead>
                      <tr className='dark:text-white text-left'>
                        <th className='py-4'>Country</th>
                        <th className='text-right'>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                    visibleConsuptionsRows.map((item, index) => (
                      <tr className='hover:shadow-xl rounded-xl text-left' key={index + '_' + item.countryRegionId}>
                        <td className='px-6 py-2'>{item.countryRegionName}</td>
                        <td className='px-6 text-right'>{item.value}</td>
                      </tr>
                    ))
                    }
                    </tbody>
                  </table>
                  {
                    !agreed &&
                    <Pagination page={page} setPage={setPage} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} results={dataConsumptions.length} />
                  }
                </div>
              }
            </div>
            <div className='flex-1'>
              <div className='mx-8 p-24'>
                <Chart id="brent" valuesBrent={brent} />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default App
