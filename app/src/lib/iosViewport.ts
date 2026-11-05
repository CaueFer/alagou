const KEYBOARD_INPUT_SELECTOR = "input:not([type=file]):not([type=checkbox]):not([type=radio]), textarea, select";
const SETTLE_DELAYS_MS = [100, 500];

function isIOS(): boolean {
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isViewportTransient(): boolean {
  const isKeyboardOpen = document.activeElement?.matches(KEYBOARD_INPUT_SELECTOR) ?? false;
  const isPinchZoomed = (window.visualViewport?.scale ?? 1) > 1.01;
  return isKeyboardOpen || isPinchZoomed;
}

export function installIOSViewportFix(): void {
  if (!isIOS()) {
    return;
  }

  const root = document.documentElement;
  root.classList.add("ios");

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const tallestHeightByWidth = new Map<number, number>();
  let appliedHeight = 0;

  function resolveHeight(): number {
    if (!isStandalone) {
      return window.innerHeight;
    }
    // Installed PWAs have no browser toolbars, so a smaller height after returning from the camera is a stale WebKit value.
    const height = Math.max(window.innerHeight, tallestHeightByWidth.get(window.innerWidth) ?? 0);
    tallestHeightByWidth.set(window.innerWidth, height);
    return height;
  }

  function sync() {
    if (isViewportTransient()) {
      return;
    }
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    const height = resolveHeight();
    if (height !== appliedHeight) {
      appliedHeight = height;
      root.style.setProperty("--app-height", `${height}px`);
      // Leaflet only re-measures its container on window resize, and this height can change without one.
      window.dispatchEvent(new Event("resize"));
    }
  }

  function syncAfterSettling() {
    sync();
    SETTLE_DELAYS_MS.forEach((delay) => window.setTimeout(sync, delay));
  }

  sync();

  window.addEventListener("resize", sync);
  window.visualViewport?.addEventListener("resize", sync);
  window.addEventListener("orientationchange", syncAfterSettling);
  window.addEventListener("pageshow", syncAfterSettling);
  window.addEventListener("focus", syncAfterSettling);
  document.addEventListener("visibilitychange", syncAfterSettling);
  document.addEventListener("focusout", syncAfterSettling);
  document.addEventListener("change", syncAfterSettling, true);
  document.addEventListener("cancel", syncAfterSettling, true);
}
