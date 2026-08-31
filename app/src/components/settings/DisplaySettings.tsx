import { useState } from "react";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import {
  getDistanceUnit,
  getMapType,
  setDistanceUnit,
  setMapType,
  type DistanceUnit,
  type MapType,
} from "@/lib/settingsPreference";

const MAP_TYPE_OPTIONS: SegmentedOption<MapType>[] = [
  { value: "standard", label: "Padrão" },
  { value: "satellite", label: "Satélite" },
];

const DISTANCE_UNIT_OPTIONS: SegmentedOption<DistanceUnit>[] = [
  { value: "km", label: "km" },
  { value: "m", label: "m" },
];

export function DisplaySettings() {
  const [mapType, setMapTypeState] = useState<MapType>(() => getMapType());
  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>(() => getDistanceUnit());

  function handleMapTypeChange(value: MapType) {
    setMapTypeState(value);
    setMapType(value);
  }

  function handleDistanceUnitChange(value: DistanceUnit) {
    setDistanceUnitState(value);
    setDistanceUnit(value);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Exibição</h2>

      <div className="rounded-lg border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
        <div className="flex flex-col gap-2 border-b border-border pb-3">
          <p className="text-sm font-medium">Tipo de mapa</p>
          <SegmentedControl options={MAP_TYPE_OPTIONS} value={mapType} onValueChange={handleMapTypeChange} />
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <p className="text-sm font-medium">Unidade de distância</p>
          <SegmentedControl
            options={DISTANCE_UNIT_OPTIONS}
            value={distanceUnit}
            onValueChange={handleDistanceUnitChange}
          />
        </div>
      </div>
    </section>
  );
}