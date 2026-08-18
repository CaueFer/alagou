import type { ReactNode } from "react";

export function MobileViewport({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-zinc-900 min-[481px]:items-center min-[481px]:py-6">
      <div
        className="relative h-dvh w-full overflow-hidden bg-background [transform:translateZ(0)] min-[481px]:h-[min(100dvh,900px)] min-[481px]:max-w-[430px] min-[481px]:rounded-[2rem] min-[481px]:border min-[481px]:border-black/10 min-[481px]:shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}
