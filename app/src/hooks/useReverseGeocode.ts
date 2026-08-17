import { useEffect, useState } from "react";
import type { AlertLocation } from "@/types/alert";

const FALLBACK_LABEL = "Local não identificado";
const cache = new Map<string, string>();

interface NominatimAddress {
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
}

function formatAddress(address: NominatimAddress | undefined): string {
  if (!address) {
    return FALLBACK_LABEL;
  }
  const street = address.road;
  const neighborhood = address.suburb ?? address.neighbourhood ?? address.city_district;
  const parts = [street, neighborhood].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(", ");
  }
  return address.city ?? address.town ?? address.village ?? FALLBACK_LABEL;
}

function cacheKey(location: AlertLocation): string {
  return `${location.lat.toFixed(5)},${location.lng.toFixed(5)}`;
}

export function useReverseGeocode(location: AlertLocation | null) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setAddress(null);
      return;
    }

    const key = cacheKey(location);
    const cached = cache.get(key);
    if (cached) {
      setAddress(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setAddress(null);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("reverse geocode failed"))))
      .then((data: { address?: NominatimAddress }) => {
        if (cancelled) return;
        const label = formatAddress(data.address);
        cache.set(key, label);
        setAddress(label);
      })
      .catch(() => {
        if (!cancelled) {
          setAddress(FALLBACK_LABEL);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng]);

  return { address, loading } as const;
}
