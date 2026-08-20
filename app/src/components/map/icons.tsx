interface IconProps {
  className?: string;
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 3v1.5" />
      <path d="M12 19.5v1.5" />
      <path d="M3 12h1.5" />
      <path d="M19.5 12h1.5" />
      <path d="M6 6l1.1 1.1" />
      <path d="M16.9 16.9l1.1 1.1" />
      <path d="M6 18l1.1-1.1" />
      <path d="M16.9 7.1l1.1-1.1" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13.5c-1 3.2-4 5.5-7.5 5.5c-4.4 0-8-3.6-8-8c0-3.5 2.3-6.5 5.5-7.5c-0.6 1.1-1 2.4-1 3.8c0 4.1 3.4 7.5 7.5 7.5c1.4 0 2.7-0.4 3.5-1.3z" />
    </svg>
  );
}

export function CloudIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.5 17c1.9 0 3.5-1.6 3.5-3.5c0-1.8-1.3-3.2-3.1-3.5c-0.5-2.2-2.5-3.8-4.9-3.8c-2.6 0-4.7 1.9-5.1 4.4c-1.7 0.3-3 1.8-3 3.6c0 2 1.6 3.6 3.6 3.6h9z" />
    </svg>
  );
}

export function CloudSunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8" r="3.2" />
      <path d="M8.5 2.5v1.2" />
      <path d="M3.4 5.4l0.9 0.9" />
      <path d="M2.2 8h1.2" />
      <path d="M4.8 4.2l0.9 0.9" />
      <path d="M17.5 18.5c1.9 0 3.5-1.6 3.5-3.5c0-1.8-1.3-3.2-3.1-3.5c-0.5-2.1-2.4-3.7-4.7-3.7c-0.3 0-0.6 0-0.9 0.1c0.5 0.7 0.8 1.5 1 2.4c1.9 0.5 3.4 2.1 3.7 4.1c0.9 0.4 1.6 1.2 1.9 2.1c-0.5 1.4-1.8 2.4-3.3 2.4h-8.5c-2 0-3.6-1.6-3.6-3.6c0-1.8 1.3-3.3 3-3.6c0.1-0.5 0.3-1 0.6-1.4c-0.3 0.7-0.5 1.5-0.5 2.3c0 0.2 0 0.5 0.1 0.7c-1.5 0.4-2.6 1.8-2.6 3.4c0 2 1.6 3.6 3.6 3.6h9.3z" />
    </svg>
  );
}

export function CloudMoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 8.2c-0.3 3-2.6 5.3-5.6 5.6c0.7 0.9 1.8 1.5 3 1.5c2.1 0 3.9-1.6 4.1-3.7c0.1-1.2-0.4-2.4-1.5-3.4z" />
      <path d="M17.5 18.5c1.9 0 3.5-1.6 3.5-3.5c0-1.8-1.3-3.2-3.1-3.5c-0.5-2.2-2.5-3.8-4.9-3.8c-0.4 0-0.9 0.1-1.3 0.2c0.4 0.9 0.6 1.9 0.5 2.9c-0.2 2-1.5 3.6-3.3 4.3c-0.3 0.4-0.5 0.8-0.6 1.3c-1.7 0.3-3 1.8-3 3.6c0 2 1.6 3.6 3.6 3.6h9c1.9 0 3.5-1.6 3.5-3.5c0-1-0.4-1.9-1.1-2.5c0.3 0.3 0.5 0.6 0.7 1z" />
    </svg>
  );
}

export function FogIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 10.5c1.7 0.2 3 1.7 3 3.4" />
      <path d="M4.3 12.6c0-2.4 2-4.4 4.5-4.4c2.1 0 3.9 1.4 4.4 3.3" />
      <path d="M3 16h18" />
      <path d="M5.5 19h13" />
      <path d="M3 13h4" />
    </svg>
  );
}

export function RainIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 12c1.9 0 3.5-1.6 3.5-3.5c0-1.8-1.3-3.2-3.1-3.5c-0.5-2.2-2.5-3.8-4.9-3.8c-2.6 0-4.7 1.9-5.1 4.4c-1.7 0.3-3 1.8-3 3.6c0 1.6 1 2.9 2.4 3.5" />
      <path d="M8 16.5l-1.2 2.2" />
      <path d="M12 16.5l-1.2 2.2" />
      <path d="M16 16.5l-1.2 2.2" />
    </svg>
  );
}

export function StormIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 11c1.9 0 3.5-1.6 3.5-3.5c0-1.8-1.3-3.2-3.1-3.5c-0.5-2.2-2.5-3.8-4.9-3.8c-2.6 0-4.7 1.9-5.1 4.4c-1.7 0.3-3 1.8-3 3.6c0 1.6 1 2.9 2.4 3.5" />
      <path d="M13 13.5l-3 4h3l-2 4.5" />
    </svg>
  );
}

export function getWeatherIcon(weatherCode: number | null, isDay: boolean) {
  if (weatherCode === null) {
    return isDay ? CloudSunIcon : CloudMoonIcon;
  }
  if (weatherCode === 0) {
    return isDay ? SunIcon : MoonIcon;
  }
  if (weatherCode >= 1 && weatherCode <= 2) {
    return isDay ? CloudSunIcon : CloudMoonIcon;
  }
  if (weatherCode === 3) {
    return CloudIcon;
  }
  if (weatherCode === 45 || weatherCode === 48) {
    return FogIcon;
  }
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return RainIcon;
  }
  if (weatherCode >= 95 && weatherCode <= 99) {
    return StormIcon;
  }
  return CloudIcon;
}
