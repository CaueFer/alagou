const DEVICE_USERNAME_STORAGE_KEY = "alagou.device.username";
const DEVICE_ID_STORAGE_KEY = "alagou.device.id";

export function getDeviceUsername(): string {
  const stored = localStorage.getItem(DEVICE_USERNAME_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const generated = `Anônimo-${Math.random().toString(16).slice(2, 6)}`;
  localStorage.setItem(DEVICE_USERNAME_STORAGE_KEY, generated);
  return generated;
}

export function getDeviceId(): string {
  const stored = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  const generated = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
  return generated;
}
