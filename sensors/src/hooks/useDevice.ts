import { useCallback, useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { getErrorMessage } from "./utils";

type DeviceInfoState = Awaited<ReturnType<typeof Device.getInfo>>;
type DeviceBatteryState = Awaited<ReturnType<typeof Device.getBatteryInfo>>;
type DeviceLanguageState = Awaited<ReturnType<typeof Device.getLanguageCode>>;
type DeviceIdState = Awaited<ReturnType<typeof Device.getId>>;

export const useDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoState | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<DeviceBatteryState | null>(
    null,
  );
  const [languageInfo, setLanguageInfo] = useState<DeviceLanguageState | null>(
    null,
  );
  const [deviceId, setDeviceId] = useState<DeviceIdState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeviceData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [info, battery, language, id] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo(),
        Device.getLanguageCode(),
        Device.getId(),
      ]);

      setDeviceInfo(info);
      setBatteryInfo(battery);
      setLanguageInfo(language);
      setDeviceId(id);
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible obtener la informacion del dispositivo.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDeviceData();
  }, [loadDeviceData]);

  return {
    deviceInfo,
    batteryInfo,
    languageInfo,
    deviceId,
    loading,
    error,
    reload: loadDeviceData,
  };
};
