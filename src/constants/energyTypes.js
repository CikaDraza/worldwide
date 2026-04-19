// Energy type definitions and EIA API configurations
export const ENERGY_TYPES = {
  OIL: 'oil',
  GAS: 'gas',
  NUCLEAR: 'nuclear',
  ELECTRIC: 'electric',
  BIO: 'bio',
};

export const ENERGY_CONFIG = {
  [ENERGY_TYPES.OIL]: {
    label: 'Oil',
    icon: 'oil',
    color: '#F59E0B',
    unit: 'TBPD',
    unitLabel: 'Thousand Barrels/Day',
    priceUnit: 'WTI/Brent ($/barrel)',
    productId: '4415',
    activityIds: { production: '1', consumption: '2' },
    hasPriceData: true,
  },
  [ENERGY_TYPES.GAS]: {
    label: 'Natural Gas (NLG)',
    icon: 'gas',
    color: '#3B82F6',
    unit: 'QBTU',
    unitLabel: 'Quadrillion BTU',
    priceUnit: 'NLG Price',
    productId: '26',
    activityIds: { production: '1', consumption: '2' },
    hasPriceData: false,
  },
  [ENERGY_TYPES.NUCLEAR]: {
    label: 'Nuclear',
    icon: 'nuclear',
    color: '#8B5CF6',
    unit: 'QBTU',
    unitLabel: 'Quadrillion BTU',
    priceUnit: 'BTU',
    productId: '14',
    activityIds: { production: '1', consumption: '2' },
    hasPriceData: false,
  },
  [ENERGY_TYPES.ELECTRIC]: {
    label: 'Electricity',
    icon: 'electric',
    color: '#20F3C7',
    unit: 'BKWH',
    unitLabel: 'Billion kWh',
    priceUnit: 'BTU',
    productId: '2',
    activityIds: { production: '1', consumption: '2' },
    hasPriceData: false,
  },
  [ENERGY_TYPES.BIO]: {
    label: 'Bio Energy',
    icon: 'bio',
    color: '#10B981',
    unit: 'QBTU',
    unitLabel: 'Quadrillion BTU',
    priceUnit: 'BTU',
    productId: '44',
    activityIds: { production: '1', consumption: '2' },
    hasPriceData: false,
  },
};

export const FREQUENCY = {
  ANNUAL: 'annual',
  MONTHLY: 'monthly',
  DAILY: 'daily',
};

export const SCOPE = {
  WORLD: 'world',
  COUNTRY: 'country',
};

export const WORLD_REGION_ID = 'WORL';

// Countries list for API queries
export const COUNTRY_IDS = [
  'ABW','AFG','AGO','ALB','ARE','ARG','ARM','ASM','ATG','AUS','AUT','AZE',
  'BDI','BEL','BEN','BFA','BGD','BGR','BHR','BHS','BIH','BLR','BLZ','BOL',
  'BRA','BRB','BRN','BTN','BWA','CAN','CHE','CHL','CHN','CIV','CMR','COD',
  'COG','COL','CPV','CRI','CUB','CYP','CZE','DEU','DJI','DNK','DOM','DZA',
  'ECU','EGY','ERI','ESP','EST','ETH','FIN','FJI','FRA','GAB','GBR','GEO',
  'GHA','GIN','GMB','GNB','GNQ','GRC','GRL','GTM','GUY','HKG','HND','HRV',
  'HTI','HUN','IDN','IND','IRL','IRN','IRQ','ISL','ISR','ITA','JAM','JOR',
  'JPN','KAZ','KEN','KGZ','KHM','KOR','KWT','LAO','LBN','LBR','LBY','LCA',
  'LKA','LSO','LTU','LUX','LVA','MAC','MAR','MDA','MDG','MDV','MEX','MKD',
  'MLI','MLT','MMR','MNE','MNG','MOZ','MRT','MUS','MWI','MYS','NAM','NCL',
  'NER','NGA','NIC','NLD','NOR','NPL','NZL','OMN','PAK','PAN','PER','PHL',
  'PNG','POL','PRI','PRT','PRY','QAT','ROU','RUS','RWA','SAU','SDN','SEN',
  'SGP','SLE','SLV','SOM','SRB','SSD','SUR','SVK','SVN','SWE','SWZ','SYR',
  'TCD','TGO','THA','TJK','TKM','TTO','TUN','TUR','TWN','TZA','UGA','UKR',
  'URY','USA','UZB','VEN','VNM','YEM','ZAF','ZMB','ZWE',
];
