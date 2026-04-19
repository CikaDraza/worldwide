// All EIA API calls - API key hidden via env variable
const API_KEY = import.meta.env.VITE_EIA_API_KEY;
const BASE_URL = 'https://api.eia.gov/v2';

function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function fetchEIA(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EIA API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.response?.data ?? [];
}

// --- Oil Price APIs ---
export async function fetchWTIDaily() {
  return fetchEIA('/petroleum/pri/spt/data/', {
    frequency: 'daily',
    'data[0]': 'value',
    'facets[series][]': 'RWTC',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    offset: 0,
    length: 365,
  });
}

export async function fetchBrentDaily() {
  return fetchEIA('/petroleum/pri/spt/data/', {
    frequency: 'daily',
    'data[0]': 'value',
    'facets[series][]': 'RBRTE',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    offset: 0,
    length: 365,
  });
}

// --- International Energy Data ---
export async function fetchWorldData({ productId, activityId, frequency = 'annual', start = '2015' }) {
  return fetchEIA('/international/data/', {
    frequency,
    'data[0]': 'value',
    'facets[activityId][]': activityId,
    'facets[productId][]': productId,
    'facets[countryRegionId][]': 'WORL',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    start,
    offset: 0,
    length: 500,
  });
}

export async function fetchCountriesData({ productId, activityId, frequency = 'annual', start = '2010', countryIds }) {
  const params = {
    frequency,
    'data[0]': 'value',
    'facets[activityId][]': activityId,
    'facets[productId][]': productId,
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    start,
    end: '2023',
    offset: 0,
    length: 5000,
  };

  // Add country IDs
  countryIds.forEach(id => {
    params[`facets[countryRegionId][]`] = params[`facets[countryRegionId][]`]
      ? [...(Array.isArray(params[`facets[countryRegionId][]`]) ? params[`facets[countryRegionId][]`] : [params[`facets[countryRegionId][]`]]), id]
      : id;
  });

  return fetchEIA('/international/data/', params);
}

// Helper to build country data URL with all country IDs (using append pattern)
export async function fetchCountriesDataBulk({ productId, activityId, frequency = 'annual', start = '2010', countryIds }) {
  const url = new URL(`${BASE_URL}/international/data/`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('frequency', frequency);
  url.searchParams.append('data[0]', 'value');
  url.searchParams.append('facets[activityId][]', activityId);
  url.searchParams.append('facets[productId][]', productId);
  countryIds.forEach(id => url.searchParams.append('facets[countryRegionId][]', id));
  url.searchParams.set('sort[0][column]', 'period');
  url.searchParams.set('sort[0][direction]', 'desc');
  url.searchParams.set('start', start);
  url.searchParams.set('end', '2023');
  url.searchParams.set('offset', '0');
  url.searchParams.set('length', '5000');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`EIA API error: ${res.status}`);
  const data = await res.json();
  return data.response?.data ?? [];
}
