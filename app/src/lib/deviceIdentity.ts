const DEVICE_USERNAME_STORAGE_KEY = "alagou.device.username";

export function getDeviceUsername(): string {
  const stored = localStorage.getItem(DEVICE_USERNAME_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const generated = `Anônimo-${Math.random().toString(16).slice(2, 6)}`;
  localStorage.setItem(DEVICE_USERNAME_STORAGE_KEY, generated);
  return generated;
}
