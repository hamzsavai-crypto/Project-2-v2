import type { ControlDef } from "@/lib/types";
import { fmt } from "@/lib/physics";

export function Slider({
  def,
  value,
  onChange,
}: {
  def: ControlDef;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs text-lab-mute">{def.label}</span>
        <span className="readout text-sm text-lab-phosphor">
          {fmt(value, def.step < 0.1 ? 2 : def.step < 1 ? 2 : 1)} {def.unit}
        </span>
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-lab-line accent-lab-phosphor"
      />
    </label>
  );
}
