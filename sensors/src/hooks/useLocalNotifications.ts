import { useCallback, useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { PluginListenerHandle } from "@capacitor/core";
import { getErrorMessage } from "./utils";

type PermissionState = Awaited<
  ReturnType<typeof LocalNotifications.checkPermissions>
>;

type LocalNotificationSchema = Awaited<
  ReturnType<typeof LocalNotifications.getDeliveredNotifications>
>["notifications"][number];

export const useLocalNotifications = () => {
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [lastNotification, setLastNotification] =
    useState<LocalNotificationSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    setError(null);

    try {
      const currentPermission = await LocalNotifications.checkPermissions();

      if (currentPermission.display === "granted") {
        setPermission(currentPermission);
        return currentPermission;
      }

      const requestedPermission = await LocalNotifications.requestPermissions();
      setPermission(requestedPermission);

      if (requestedPermission.display !== "granted") {
        throw new Error("Permiso de notificaciones locales denegado.");
      }

      return requestedPermission;
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible solicitar permisos de notificaciones locales.",
        ),
      );
      return null;
    }
  }, []);

  const schedule = useCallback(
    async (
      title: string,
      body: string,
      delayInSeconds = 2,
      id = Date.now(),
    ) => {
      setError(null);

      try {
        const permissionResult = await requestPermission();

        if (!permissionResult || permissionResult.display !== "granted") {
          return null;
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              id,
              title,
              body,
              schedule: {
                at: new Date(Date.now() + delayInSeconds * 1000),
                allowWhileIdle: true,
              },
            },
          ],
        });

        return id;
      } catch (hookError: unknown) {
        setError(
          getErrorMessage(
            hookError,
            "No fue posible programar la notificacion local.",
          ),
        );
        return null;
      }
    },
    [requestPermission],
  );

  useEffect(() => {
    let receivedListener: PluginListenerHandle | undefined;

    const setupListener = async () => {
      receivedListener = await LocalNotifications.addListener(
        "localNotificationReceived",
        (notification) => {
          setLastNotification(notification);
        },
      );
    };

    void setupListener();

    return () => {
      void receivedListener?.remove();
    };
  }, []);

  return {
    permission,
    lastNotification,
    error,
    requestPermission,
    schedule,
  };
};
