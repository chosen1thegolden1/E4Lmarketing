// Google Places API (New) — Text Search.
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.internationalPhoneNumber',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.types',
  'places.businessStatus',
  'places.googleMapsUri',
  'nextPageToken',
].join(',');

// Rough heuristic to skip chains/franchises where cold outreach flops.
// Not perfect — Rozel is the final filter.
const CHAIN_HINTS = /\b(Great\s?Clips|Supercuts|Sport\s?Clips|Massage\s?Envy|Bath\s?&\s?Body|Ulta|Sephora|LensCrafters|Pearle\s?Vision|Marriott|Hilton|Hyatt|IHOP|Denny|McDonald|Subway|Chipotle|Starbucks|Panera|Domino|Papa\s?John|Pizza\s?Hut|Home\s?Depot|Lowe|Walmart|Target|Costco|CVS|Walgreens|Rite\s?Aid|7-Eleven|AutoZone|O'?Reilly|Advance\s?Auto|Jiffy\s?Lube|Valvoline|Midas|Meineke|Firestone|Discount\s?Tire|Enterprise\s?Rent|Hertz|Avis|Budget|U-Haul|Public\s?Storage|Extra\s?Space|LA\s?Fitness|Planet\s?Fitness|Anytime\s?Fitness|24\s?Hour\s?Fitness|Orange\s?Theory|F45|SoulCycle|CorePower|European\s?Wax|Massage\s?Heights|Hand\s?&\s?Stone|Elements\s?Massage|Aspen\s?Dental|Pacific\s?Dental|Western\s?Dental|Bright\s?Now|Kids\s?Care|H&R\s?Block|Jackson\s?Hewitt|Liberty\s?Tax|Servpro|Servicemaster|Chem-Dry|Stanley\s?Steemer|Roto-Rooter|Mr\s?Rooter|Bath\s?Fitter|Empire\s?Today|Anago|JAN-PRO|Coverall|Merry\s?Maids|Molly\s?Maid|Two\s?Men|Handy|Angi|Yelp)\b/i;

export async function searchPlaces({ apiKey, query, count = 20, skipChains = true }) {
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY missing');

  const results = [];
  let pageToken;
  // Google returns up to 20 per page; up to 3 pages (60 total) via nextPageToken.
  while (results.length < count) {
    const body = { textQuery: query, maxResultCount: Math.min(20, count - results.length) };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELDS,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Places API ${res.status}: ${err.slice(0, 300)}`);
    }
    const data = await res.json();
    for (const p of data.places || []) {
      if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') continue;
      if (skipChains && CHAIN_HINTS.test(p.displayName?.text || '')) continue;
      if (!p.websiteUri) continue; // cold outreach needs a website
      results.push({
        placeId: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || '',
        phone: p.internationalPhoneNumber || p.nationalPhoneNumber || '',
        website: p.websiteUri,
        rating: p.rating || null,
        reviewCount: p.userRatingCount || 0,
        types: p.types || [],
        mapsUri: p.googleMapsUri || '',
      });
      if (results.length >= count) break;
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
    // Google requires a short delay before using a page token
    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}
