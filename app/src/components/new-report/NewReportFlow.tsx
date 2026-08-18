import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LocationStep } from "@/components/new-report/LocationStep";
import { NameStep } from "@/components/new-report/NameStep";
import { PhotoStep } from "@/components/new-report/PhotoStep";
import { SeveritySelector } from "@/components/new-report/SeveritySelector";
import type { Alert, AlertLocation, NewAlertInput, Severity } from "@/types/alert";

const STEPS = ["location", "name", "photos", "severity"] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLES: Record<Step, string> = {
  location: "Onde é o alagamento?",
  name: "Identificação",
  photos: "Fotos",
  severity: "Severidade",
};

interface FormState {
  location: AlertLocation | null;
  username: string;
  photos: File[];
  severity: Severity | null;
}

const INITIAL_FORM_STATE: FormState = { location: null, username: "", photos: [], severity: null };

interface NewReportFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: NewAlertInput) => Promise<Alert>;
  onCreated: (alert: Alert) => void;
}

export function NewReportFlow({ open, onOpenChange, onSubmit, onCreated }: NewReportFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setForm(INITIAL_FORM_STATE);
      setSubmitError(null);
    }
  }, [open]);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const canAdvance = step !== "location" || form.location !== null;
  const canSubmit = form.severity !== null;

  async function handlePrimaryAction() {
    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      return;
    }

    if (!form.location || !form.severity) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const alert = await onSubmit({
        location: form.location,
        severity: form.severity,
        username: form.username.trim() || null,
        photos: form.photos,
      });
      onCreated(alert);
      onOpenChange(false);
    } catch {
      setSubmitError("Não foi possível enviar o relato. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{STEP_TITLES[step]}</DrawerTitle>
        </DrawerHeader>

        {step === "location" && (
          <LocationStep
            location={form.location}
            onChangeLocation={(location) => setForm((prev) => ({ ...prev, location }))}
          />
        )}
        {step === "name" && (
          <NameStep
            username={form.username}
            onChangeUsername={(username) => setForm((prev) => ({ ...prev, username }))}
          />
        )}
        {step === "photos" && (
          <PhotoStep photos={form.photos} onChangePhotos={(photos) => setForm((prev) => ({ ...prev, photos }))} />
        )}
        {step === "severity" && (
          <SeveritySelector
            value={form.severity}
            onChange={(severity) => setForm((prev) => ({ ...prev, severity }))}
          />
        )}

        <DrawerFooter>
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <Button variant="outline" onClick={() => setStepIndex((index) => index - 1)} disabled={submitting}>
                Voltar
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handlePrimaryAction}
              disabled={submitting || (isLastStep ? !canSubmit : !canAdvance)}
            >
              {isLastStep ? (submitting ? "Enviando..." : "Reportar") : "Continuar"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
