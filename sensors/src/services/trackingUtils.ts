import type { NearbyPlace } from "./opencageService";

export type TrackingPoint = {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  batteryLevel: number | null;
  connectionType: string;
  moving: boolean;
};

export const toDecimal = (
  value: number | null | undefined,
  digits = 6,
): string => (typeof value === "number" ? value.toFixed(digits) : "-");

export const toPercent = (value: number | null): string =>
  typeof value === "number" ? `${Math.round(value * 100)}%` : "-";

export const formatDateLabel = (timestamp: number): string =>
  new Date(timestamp).toLocaleString("es-CO");

export const groupHistoryByDay = (
  history: TrackingPoint[],
): Array<[string, TrackingPoint[]]> => {
  const groups = new Map<string, TrackingPoint[]>();

  history.forEach((point) => {
    const key = new Date(point.timestamp).toLocaleDateString("sv-SE");
    const current = groups.get(key) ?? [];
    current.push(point);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
};

export const buildStaticMapUrl = (
  latitude: number,
  longitude: number,
  places: NearbyPlace[],
): string => {
  const centerMarker = `${latitude},${longitude}`;
  const placeMarkers = places
    .slice(0, 4)
    .map((place) => `${place.latitude},${place.longitude}`)
    .join("|");

  const markers = [centerMarker, placeMarkers].filter(Boolean).join("|");

  const params = new URLSearchParams({
    center: `${latitude},${longitude}`,
    zoom: "14",
    size: "800x360",
    markers,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
};

export const buildOsmEmbedMapUrl = (
  latitude: number,
  longitude: number,
): string => {
  const delta = 0.01;
  const left = longitude - delta;
  const right = longitude + delta;
  const top = latitude + delta;
  const bottom = latitude - delta;

  const params = new URLSearchParams({
    bbox: `${left},${bottom},${right},${top}`,
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
};

export const addWatermark = async (
  photoDataUrl: string,
  watermark: string,
): Promise<string> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No fue posible cargar la imagen."));
    img.src = photoDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No fue posible crear el contexto para watermark.");
  }

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const fontSize = Math.max(18, Math.round(canvas.width * 0.032));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  const padding = 12;
  const textX = padding;
  const textY = canvas.height - padding;
  const textWidth = ctx.measureText(watermark).width;

  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  ctx.fillRect(
    textX - 10,
    textY - fontSize - 10,
    textWidth + 20,
    fontSize + 18,
  );

  ctx.fillStyle = "#ffffff";
  ctx.fillText(watermark, textX, textY);

  return canvas.toDataURL("image/jpeg", 0.92);
};
