export const TRACKING_FILE_NAME = "tracking-history.json";

export const TRACKING_THRESHOLDS = {
  lowBattery: 0.2,
  fastSpeedMps: 8.33,
  noMovementAlertMs: 2 * 60 * 1000,
  movementDelta: 0.12,
} as const;

export const TRACKING_INTERVALS = {
  batteryRefreshMs: 45_000,
  motionSampleMs: 250,
  historyPersistMs: 5_000,
  historySampleMs: 2_000,
  geolocationMinUpdateMs: 1_500,
  autoStopGraceMs: 15_000,
  autoToggleCooldownMs: 6_000,
} as const;
