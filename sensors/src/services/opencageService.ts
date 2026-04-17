const OPENCAGE_BASE_URL = "https://api.opencagedata.com/geocode/v1/json";
const NEARBY_MAX_DISTANCE_KM = 25;
const NEARBY_SEARCH_DELTA = 0.12;

export interface NearbyPlace {
  id: string;
  name: string;
  formatted: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface OpenCageResult {
  formatted?: string;
  geometry?: {
    lat?: number;
    lng?: number;
  };
}

interface OpenCageResponse {
  results?: OpenCageResult[];
}

interface OpenCageRequestOptions {
  limit?: number;
  proximity?: string;
  bounds?: string;
}

const getApiKey = () => {
  const apiKey = String(import.meta.env.VITE_OPENCAGE_API_KEY ?? "").trim();

  if (!apiKey) {
    throw new Error(
      "Configura VITE_OPENCAGE_API_KEY para obtener direccion y lugares cercanos.",
    );
  }

  return apiKey;
};

const toRad = (value: number) => (value * Math.PI) / 180;

const getDistanceKm = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const requestOpenCage = async (
  query: string,
  options: OpenCageRequestOptions = {},
) => {
  const apiKey = getApiKey();
  const limit = options.limit ?? 1;

  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    language: "es",
    no_annotations: "1",
    limit: String(limit),
    pretty: "1",
  });

  if (options.proximity) {
    params.set("proximity", options.proximity);
  }

  if (options.bounds) {
    params.set("bounds", options.bounds);
  }

  const response = await fetch(`${OPENCAGE_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("No fue posible consultar OpenCage.");
  }

  const payload = (await response.json()) as OpenCageResponse;

  return payload;
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  const payload = await requestOpenCage(`${latitude}, ${longitude}`, {
    limit: 1,
  });
  return payload.results?.[0]?.formatted ?? null;
};

export const getNearbyPlaces = async (latitude: number, longitude: number) => {
  const searchTerms = ["hospital", "farmacia", "parque", "restaurante", "cafe"];
  const minLon = longitude - NEARBY_SEARCH_DELTA;
  const minLat = latitude - NEARBY_SEARCH_DELTA;
  const maxLon = longitude + NEARBY_SEARCH_DELTA;
  const maxLat = latitude + NEARBY_SEARCH_DELTA;

  const bounds = `${minLon},${minLat},${maxLon},${maxLat}`;
  const proximity = `${longitude},${latitude}`;

  const responses = await Promise.all(
    searchTerms.map((term) =>
      requestOpenCage(term, {
        limit: 3,
        bounds,
        proximity,
      }),
    ),
  );

  const dedupe = new Set<string>();
  const places: NearbyPlace[] = [];

  responses.forEach((payload, index) => {
    const result = payload.results?.[0];
    const placeLat = result?.geometry?.lat;
    const placeLng = result?.geometry?.lng;
    const formatted = result?.formatted ?? null;
    const distanceKm =
      typeof placeLat === "number" && typeof placeLng === "number"
        ? getDistanceKm(latitude, longitude, placeLat, placeLng)
        : null;

    if (
      typeof placeLat !== "number" ||
      typeof placeLng !== "number" ||
      !formatted ||
      dedupe.has(formatted) ||
      distanceKm === null ||
      distanceKm > NEARBY_MAX_DISTANCE_KM
    ) {
      return;
    }

    dedupe.add(formatted);

    places.push({
      id: `${searchTerms[index]}-${placeLat}-${placeLng}`,
      name: searchTerms[index],
      formatted,
      latitude: placeLat,
      longitude: placeLng,
      distanceKm,
    });
  });

  return places.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
};
