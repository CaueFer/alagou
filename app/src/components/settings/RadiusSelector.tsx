import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { NOTIFICATION_RADIUS_KM_OPTIONS, type NotificationRadiusKm } from "@/lib/settingsPreference";

interface RadiusSelectorProps {
  value: NotificationRadiusKm;
  onValueChange: (value: NotificationRadiusKm) => void;
}

const RADIUS_OPTIONS: SegmentedOption<NotificationRadiusKm>[] = NOTIFICATION_RADIUS_KM_OPTIONS.map((km) => ({
  value: km,
  label: `${km} km`,
}));

export function RadiusSelector({ value, onValueChange }: RadiusSelectorProps) {
  return <SegmentedControl options={RADIUS_OPTIONS} value={value} onValueChange={onValueChange} />;
}