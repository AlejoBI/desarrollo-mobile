import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { getErrorMessage } from "./utils";

type PushPermission = Awaited<
  ReturnType<typeof PushNotifications.requestPermissions>
>;

const isPushEnabledByEnv =
  String(import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS ?? "false") ===
  "true";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<PushPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] =
    useState<PushNotificationSchema | null>(null);
  const [lastAction, setLastAction] = useState<ActionPerformed | null>(null);
  const [error, setError] = useState<string | null>(null);

  const listenersReadyRef = useRef(false);

  const requestPermission = useCallback(async () => {
    setError(null);

    try {
      if (!Capacitor.isPluginAvailable("PushNotifications")) {
        throw new Error(
          "Push Notifications no esta disponible en esta plataforma.",
        );
      }

      const permissionResult = await PushNotifications.requestPermissions();
      setPermission(permissionResult);

      if (permissionResult.receive !== "granted") {
        throw new Error("Permiso de push notifications denegado.");
      }

      return permissionResult;
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible solicitar permisos de push notifications.",
        ),
      );
      return null;
    }
  }, []);

  const register = useCallback(async () => {
    setError(null);

    try {
      if (!isPushEnabledByEnv) {
        throw new Error(
          "Push deshabilitado. Agrega google-services.json y define VITE_ENABLE_PUSH_NOTIFICATIONS=true para habilitar registro.",
        );
      }

      const permissionResult = await requestPermission();

      if (!permissionResult || permissionResult.receive !== "granted") {
        return;
      }

      await PushNotifications.register();
    } catch (hookError: unknown) {
      setError(
        getErrorMessage(
          hookError,
          "No fue posible registrar push notifications.",
        ),
      );
    }
  }, [requestPermission]);

  useEffect(() => {
    if (listenersReadyRef.current) {
      return;
    }

    listenersReadyRef.current = true;

    const setupListeners = async () => {
      await PushNotifications.addListener(
        "registration",
        (registeredToken: Token) => {
          setToken(registeredToken.value);
        },
      );

      await PushNotifications.addListener("registrationError", (event) => {
        setError(event.error);
      });

      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotificationSchema) => {
          setLastNotification(notification);
        },
      );

      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (action: ActionPerformed) => {
          setLastAction(action);
        },
      );
    };

    if (Capacitor.isPluginAvailable("PushNotifications")) {
      void setupListeners();
    }

    return () => {
      void PushNotifications.removeAllListeners();
      listenersReadyRef.current = false;
    };
  }, []);

  return {
    permission,
    token,
    lastNotification,
    lastAction,
    error,
    requestPermission,
    register,
  };
};
