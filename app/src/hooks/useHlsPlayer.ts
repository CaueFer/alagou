import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export type HlsPlayerStatus = "connecting" | "live" | "error";

const CONNECT_TIMEOUT_MS = 15_000;

export function useHlsPlayer(streamUrl: string, active: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<HlsPlayerStatus>("connecting");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    setStatus("connecting");

    function handleLive() {
      setStatus("live");
    }
    function handleError() {
      setStatus("error");
    }

    const connectTimeout = window.setTimeout(handleError, CONNECT_TIMEOUT_MS);
    function handleLiveAndClearTimeout() {
      window.clearTimeout(connectTimeout);
      handleLive();
    }

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          handleError();
        }
      });
      video.addEventListener("playing", handleLiveAndClearTimeout);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => video.play().catch(() => {}));
      video.addEventListener("playing", handleLiveAndClearTimeout);
      video.addEventListener("error", handleError);
    } else {
      window.clearTimeout(connectTimeout);
      setStatus("error");
    }

    return () => {
      window.clearTimeout(connectTimeout);
      video.removeEventListener("playing", handleLiveAndClearTimeout);
      video.removeEventListener("error", handleError);
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [streamUrl, active, retryToken]);

  const retry = useCallback(() => {
    setRetryToken((token) => token + 1);
  }, []);

  return { videoRef, status, retry } as const;
}
