import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import SensorPageLayout from "../components/SensorPageLayout";
import TrackingActions from "../components/tracking/TrackingActions";
import {
  useAccelerometer,
  useCamera,
  useDevice,
  useFilesystem,
  useGeolocation,
  useHaptics,
  useLocalNotifications,
  useMovementDetection,
  useNetwork,
  useTrackingAlerts,
  useTrackingHistory,
  useTrackingPlaces,
} from "../hooks";
import { APP_ROUTES } from "../constants/routes";
import {
  TRACKING_FILE_NAME,
  TRACKING_INTERVALS,
  TRACKING_THRESHOLDS,
} from "../constants/tracking";
import {
  addWatermark,
  buildOsmEmbedMapUrl,
  buildStaticMapUrl,
  toDecimal,
} from "../services/trackingUtils";
import "./TrackingPage.css";

type TrackingView = "status" | "location" | "map" | "photo" | "history";

const TrackingStatusCard = lazy(
  () => import("../components/tracking/TrackingStatusCard"),
);
const TrackingLocationCard = lazy(
  () => import("../components/tracking/TrackingLocationCard"),
);
const TrackingMapCard = lazy(
  () => import("../components/tracking/TrackingMapCard"),
);
const TrackingPhotoCard = lazy(
  () => import("../components/tracking/TrackingPhotoCard"),
);
const TrackingHistoryCard = lazy(
  () => import("../components/tracking/TrackingHistoryCard"),
);

const trackingRoutesByView: Record<TrackingView, string> = {
  status: APP_ROUTES.TRACKING_STATUS,
  location: APP_ROUTES.TRACKING_LOCATION,
  map: APP_ROUTES.TRACKING_MAP,
  photo: APP_ROUTES.TRACKING_PHOTO,
  history: APP_ROUTES.TRACKING_HISTORY,
};

const getViewByPathname = (pathname: string): TrackingView => {
  if (pathname.startsWith(APP_ROUTES.TRACKING_LOCATION)) {
    return "location";
  }

  if (pathname.startsWith(APP_ROUTES.TRACKING_MAP)) {
    return "map";
  }

  if (pathname.startsWith(APP_ROUTES.TRACKING_PHOTO)) {
    return "photo";
  }

  if (pathname.startsWith(APP_ROUTES.TRACKING_HISTORY)) {
    return "history";
  }

  return "status";
};

const isTrackingView = (value: string): value is TrackingView =>
  Object.prototype.hasOwnProperty.call(trackingRoutesByView, value);

const TrackingPage: React.FC = () => {
  const routerHistory = useHistory();
  const location = useLocation();

  const {
    currentPosition,
    isWatching,
    loading: geolocationLoading,
    error: geolocationError,
    getCurrentLocation,
    startWatching,
    stopWatching,
  } = useGeolocation({
    minimumUpdateIntervalMs: TRACKING_INTERVALS.geolocationMinUpdateMs,
  });
  const {
    acceleration,
    start: startMotion,
    stop: stopMotion,
    error: motionError,
  } = useAccelerometer({
    sampleIntervalMs: TRACKING_INTERVALS.motionSampleMs,
  });
  const { isOnline, connectionType } = useNetwork();
  const {
    batteryInfo,
    reloadBattery,
    error: deviceError,
  } = useDevice({ autoLoad: false });
  const { vibrate, error: hapticsError } = useHaptics();
  const { schedule, error: notificationsError } = useLocalNotifications();
  const { getPhoto, loading: cameraLoading, error: cameraError } = useCamera();
  const {
    readTextFile,
    writeTextFile,
    fileUri,
    error: filesystemError,
  } = useFilesystem();

  const [watermarkedPhoto, setWatermarkedPhoto] = useState<string | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const lastToggleAtRef = useRef(0);

  const batteryLevel = batteryInfo?.batteryLevel ?? null;
  const isConnected = isOnline;
  const isBatteryLow =
    typeof batteryLevel === "number" &&
    batteryLevel <= TRACKING_THRESHOLDS.lowBattery;

  const { isMoving, movementDelta, lastMovementAt } = useMovementDetection(
    acceleration,
    TRACKING_THRESHOLDS.movementDelta,
  );

  const speedMps = currentPosition?.coords.speed;
  const gpsMoving = typeof speedMps === "number" && speedMps > 0.35;
  const effectiveIsMoving = isMoving || gpsMoving;
  const effectiveLastMovementAt = Math.max(
    lastMovementAt,
    currentPosition?.timestamp ?? 0,
  );

  const canAutoTrack = trackingEnabled && isConnected && !isBatteryLow;

  const {
    address,
    nearbyPlaces,
    placesLoading,
    placesError,
    refreshAddressAndPlaces,
  } = useTrackingPlaces({
    isConnected,
    currentPosition,
    getCurrentLocation,
  });

  const { history, historyMessage } = useTrackingHistory({
    fileName: TRACKING_FILE_NAME,
    readTextFile,
    writeTextFile,
    sampleIntervalMs: TRACKING_INTERVALS.historySampleMs,
    persistIntervalMs: TRACKING_INTERVALS.historyPersistMs,
    batteryLevel,
    connectionType,
    isMoving: effectiveIsMoving,
    currentPosition,
    isWatching,
  });

  const { clearNoMovementAlertFlag } = useTrackingAlerts({
    isConnected,
    isBatteryLow,
    isWatching,
    lastMovementAt: effectiveLastMovementAt,
    currentSpeed: speedMps,
    schedule,
    noMovementAlertMs: TRACKING_THRESHOLDS.noMovementAlertMs,
    fastSpeedThresholdMps: TRACKING_THRESHOLDS.fastSpeedMps,
  });

  useEffect(() => {
    if (!trackingEnabled) {
      return;
    }

    void startMotion();
    void reloadBattery();

    const batteryInterval = window.setInterval(() => {
      void reloadBattery();
    }, TRACKING_INTERVALS.batteryRefreshMs);

    return () => {
      window.clearInterval(batteryInterval);
      void stopMotion();
    };
  }, [trackingEnabled, reloadBattery, startMotion, stopMotion]);

  useEffect(() => {
    const now = Date.now();
    const canToggleNow =
      now - lastToggleAtRef.current >= TRACKING_INTERVALS.autoToggleCooldownMs;

    if (!canAutoTrack) {
      if (isWatching && canToggleNow) {
        lastToggleAtRef.current = now;
        void stopWatching();
        clearNoMovementAlertFlag();
      }

      return;
    }

    if (!isWatching && canToggleNow) {
      lastToggleAtRef.current = now;
      void startWatching();
    }
  }, [
    canAutoTrack,
    clearNoMovementAlertFlag,
    isWatching,
    startWatching,
    stopWatching,
    vibrate,
  ]);

  const handleGetCurrentPosition = async () => {
    await getCurrentLocation();
  };

  const handleToggleTracking = async () => {
    if (trackingLoading) {
      return;
    }

    if (trackingEnabled) {
      setTrackingEnabled(false);
      clearNoMovementAlertFlag();
      return;
    }

    setTrackingLoading(true);
    await reloadBattery();

    const position = await getCurrentLocation();

    if (!position) {
      setTrackingLoading(false);
      return;
    }

    setTrackingEnabled(true);
    const started = await startWatching();

    if (started) {
      await vibrate(180);
    } else {
      setTrackingEnabled(false);
    }

    setTrackingLoading(false);
  };

  const handleTakePhoto = async () => {
    const photo = await getPhoto();

    if (!photo) {
      return;
    }

    const coords = currentPosition?.coords;

    const watermarkParts = [
      coords
        ? `Lat ${toDecimal(coords.latitude, 5)} | Lng ${toDecimal(coords.longitude, 5)}`
        : "Sin coordenadas",
      address ?? "Sin direccion",
      new Date().toLocaleString("es-CO"),
    ];

    const watermark = watermarkParts.join(" | ");
    const marked = await addWatermark(photo, watermark);
    setWatermarkedPhoto(marked);
  };

  const statusErrors = useMemo(
    () =>
      [
        geolocationError,
        motionError,
        deviceError,
        hapticsError,
        notificationsError,
        cameraError,
        filesystemError,
      ].filter((value): value is string => Boolean(value)),
    [
      cameraError,
      deviceError,
      filesystemError,
      geolocationError,
      hapticsError,
      motionError,
      notificationsError,
    ],
  );

  const mapUrl = useMemo(() => {
    if (!isConnected || !currentPosition) {
      return null;
    }

    return buildStaticMapUrl(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude,
      nearbyPlaces,
    );
  }, [currentPosition, isConnected, nearbyPlaces]);

  const mapEmbedUrl = useMemo(() => {
    if (!isConnected || !currentPosition) {
      return null;
    }

    return buildOsmEmbedMapUrl(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude,
    );
  }, [currentPosition, isConnected]);

  const activeView = useMemo(
    () => getViewByPathname(location.pathname),
    [location.pathname],
  );

  const handleViewChange = (view: TrackingView) => {
    const nextPath = trackingRoutesByView[view];

    if (location.pathname === nextPath) {
      return;
    }

    routerHistory.replace(nextPath);
  };

  return (
    <SensorPageLayout title="Tracking inteligente" showBackButton={false}>
      <IonCard>
        <IonCardContent>
          <h2>Challenge 08: Tracking Inteligente</h2>
          <p>
            Seguimiento en tiempo real con geolocalizacion, deteccion de
            movimiento, historial JSON, camara con watermark, vibracion,
            notificaciones inteligentes y lugares cercanos.
          </p>
        </IonCardContent>
      </IonCard>

      <TrackingActions
        trackingEnabled={trackingEnabled}
        trackingLoading={trackingLoading}
        manualActionsDisabled={trackingEnabled || isWatching}
        isConnected={isConnected}
        geolocationLoading={geolocationLoading}
        placesLoading={placesLoading}
        cameraLoading={cameraLoading}
        onToggleTracking={() => void handleToggleTracking()}
        onGetCurrentPosition={() => void handleGetCurrentPosition()}
        onLoadPlaces={() => void refreshAddressAndPlaces()}
        onTakePhoto={() => void handleTakePhoto()}
      />

      <IonSegment
        value={activeView}
        scrollable={true}
        onIonChange={(event) => {
          const nextValue = event.detail.value;

          if (typeof nextValue !== "string" || !isTrackingView(nextValue)) {
            return;
          }

          handleViewChange(nextValue);
        }}
        className="tracking-segment"
      >
        <IonSegmentButton value="status">
          <IonLabel>Estado</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="location">
          <IonLabel>Ubicacion</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="map">
          <IonLabel>Mapa</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="photo">
          <IonLabel>Foto</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="history">
          <IonLabel>Historial</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <Suspense
        fallback={
          <IonCard>
            <IonCardContent>Cargando seccion de tracking...</IonCardContent>
          </IonCard>
        }
      >
        <Switch>
          <Route exact path={APP_ROUTES.TRACKING_STATUS}>
            <TrackingStatusCard
              trackingEnabled={trackingEnabled}
              isWatching={isWatching}
              isConnected={isConnected}
              isMoving={effectiveIsMoving}
              isBatteryLow={isBatteryLow}
              batteryLevel={batteryLevel}
              connectionType={connectionType}
              movementDelta={movementDelta}
              lastMovementAt={effectiveLastMovementAt}
              historyMessage={historyMessage}
              errors={statusErrors}
            />
          </Route>

          <Route exact path={APP_ROUTES.TRACKING_LOCATION}>
            <TrackingLocationCard
              latitude={currentPosition?.coords.latitude}
              longitude={currentPosition?.coords.longitude}
              accuracy={currentPosition?.coords.accuracy}
              speed={currentPosition?.coords.speed}
              timestamp={currentPosition?.timestamp}
              address={address}
            />
          </Route>

          <Route exact path={APP_ROUTES.TRACKING_MAP}>
            <TrackingMapCard
              isConnected={isConnected}
              placesLoading={placesLoading}
              placesError={placesError}
              mapUrl={mapUrl}
              mapEmbedUrl={mapEmbedUrl}
              nearbyPlaces={nearbyPlaces}
            />
          </Route>

          <Route exact path={APP_ROUTES.TRACKING_PHOTO}>
            <TrackingPhotoCard photoDataUrl={watermarkedPhoto} />
          </Route>

          <Route exact path={APP_ROUTES.TRACKING_HISTORY}>
            <TrackingHistoryCard
              fileName={TRACKING_FILE_NAME}
              fileUri={fileUri}
              history={history}
            />
          </Route>

          <Route exact path={APP_ROUTES.TRACKING}>
            <Redirect to={APP_ROUTES.TRACKING_STATUS} />
          </Route>

          <Route>
            <Redirect to={APP_ROUTES.TRACKING_STATUS} />
          </Route>
        </Switch>
      </Suspense>
    </SensorPageLayout>
  );
};

export default TrackingPage;
