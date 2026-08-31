import { useCallback, useEffect, useState } from "react";

export type NotificationPermissionStatus = "default" | "granted" | "denied" | "unsupported";

function getPermission(): NotificationPermissionStatus {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return window.Notification.permission;
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermissionStatus>(getPermission);

  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }
    let status: PermissionStatus | null = null;
    const handleChange = () => setPermission(getPermission());
    navigator.permissions
      .query({ name: "notifications" })
      .then((queryStatus) => {
        status = queryStatus;
        status.addEventListener("change", handleChange);
      })
      .catch(() => {
        // Some browsers/environments reject the query; Notification.permission still updates after request().
      });
    return () => {
      status?.removeEventListener("change", handleChange);
    };
  }, []);

  const request = useCallback(async () => {
    if (!("Notification" in window)) {
      return;
    }
    const result = await window.Notification.requestPermission();
    setPermission(result);
  }, []);

  return { permission, request } as const;
}