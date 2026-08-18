interface IconProps {
  className?: string;
}

export function HandDrawnWeatherIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="4" />
      <path d="M10 3v1.5" />
      <path d="M10 16.5v1.5" />
      <path d="M3 10h1.5" />
      <path d="M15.5 10h1.5" />
      <path d="M5.5 5.5l1 1" />
      <path d="M13.5 13.5l1 1" />
      <path d="M5.5 14.5l1-1" />
      <path d="M13.5 6.5l1-1" />
      <path d="M17 14c0-1.5-1-2.5-2.5-2.5c-0.3 0-0.6 0.1-0.9 0.2c-0.4-1.5-1.8-2.7-3.6-2.7c-2 0-3.7 1.5-4 3.5c-1.2 0.3-2 1.3-2 2.5c0 1.4 1.1 2.5 2.5 2.5h8c1.4 0 2.5-1.1 2.5-2.5z" />
    </svg>
  );
}
