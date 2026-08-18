interface IconProps {
  className?: string;
}

export function HandDrawnMapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7c1.5-0.8 3-1.2 4.5-1c1.5 0.2 3 0.8 4.5 1.2c1.5 0.4 3 0.6 4.5 0.4c1.5-0.2 3-0.8 4.5-1.6" />
      <path d="M3 7v10c1.5-0.8 3-1.2 4.5-1c1.5 0.2 3 0.8 4.5 1.2c1.5 0.4 3 0.6 4.5 0.4c1.5-0.2 3-0.8 4.5-1.6V6" />
      <path d="M7.5 6v10" />
      <path d="M12 7.2v10" />
      <path d="M16.5 6.6v10" />
    </svg>
  );
}

export function HandDrawnCameraIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9c0-0.6 0.4-1 1-1h2.5c0.4 0 0.8-0.2 1-0.5l1-1.5c0.2-0.3 0.6-0.5 1-0.5h5c0.4 0 0.8 0.2 1 0.5l1 1.5c0.2 0.3 0.6 0.5 1 0.5h2.5c0.6 0 1 0.4 1 1v9c0 0.6-0.4 1-1 1H5c-0.6 0-1-0.4-1-1V9z" />
      <circle cx="12" cy="13.5" r="3.5" />
      <circle cx="12" cy="13.5" r="1.5" />
    </svg>
  );
}

export function HandDrawnShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-2.5 1.5-5 2.5-7.5 3c0 5 1 9 3.5 11.5c1.5 1.5 3 2 4 2.5c1-0.5 2.5-1 4-2.5c2.5-2.5 3.5-6.5 3.5-11.5c-2.5-0.5-5-1.5-7.5-3z" />
      <path d="M9.5 12l2 2l3.5-4" />
    </svg>
  );
}

export function HandDrawnBellIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4c0 2.5-0.5 4-1 5.5c-0.5 1.5-1 2.5-1 3.5H8c0-1-0.5-2-1-3.5c-0.5-1.5-1-3-1-5.5z" />
      <path d="M10 17c0 1.1 0.9 2 2 2s2-0.9 2-2" />
      <path d="M12 4v-1" />
      <path d="M18 9c0.5-0.5 1-1 1.5-1" />
      <path d="M6 9c-0.5-0.5-1-1-1.5-1" />
    </svg>
  );
}

export function HandDrawnUserIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4" />
      <path d="M10 8c0-0.5 0.5-1 1-1" />
    </svg>
  );
}
