import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { GOOGLE_CLIENT_ID } from "@/lib/constants";

const GOOGLE_GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }): void;
          renderButton(parent: HTMLElement, options: Record<string, string>): void;
        };
      };
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GOOGLE_GSI_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Não foi possível carregar o script do Google."));
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;

    loadGoogleIdentityScript().then(() => {
      if (cancelled || !containerRef.current || !window.google) {
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => onCredentialRef.current(response.credential),
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        locale: "pt-BR",
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={containerRef} className={cn("flex justify-center", disabled && "pointer-events-none opacity-50")} />;
}
