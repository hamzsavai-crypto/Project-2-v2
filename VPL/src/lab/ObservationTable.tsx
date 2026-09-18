import type { ColumnDef, ObservationRow } from "@/lib/types";
import { fmt } from "@/lib/physics";

export function ObservationTable({
  columns,
  rows,
  onDelete,
}: {
  columns: ColumnDef[];
  rows: ObservationRow[];
  onDelete?: (index: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-lab-line">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead className="bg-lab-bezel font-mono text-[10px] uppercase tracking-[0.18em] text-lab-mute">
          <tr>
            <th className="px-3 py-2">#</th>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2">
                {c.label} {c.unit && <span className="text-lab-phosphor/70">({c.unit})</span>}
              </th>
            ))}
            {onDelete && <th className="px-3 py-2" />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 2} className="px-3 py-6 text-center text-lab-mute">
                No readings yet. Capture from the interactive lab.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-lab-line/70">
              <td className="readout px-3 py-2 text-lab-mute">{i + 1}</td>
              {columns.map((c) => (
                <td key={c.key} className="readout px-3 py-2 text-lab-phosphor">
                  {fmt(row[c.key], 3)}
                </td>
              ))}
              {onDelete && (
                <td className="px-3 py-2 text-right">
                  <button onClick={() => onDelete(i)} className="text-xs text-lab-rose hover:underline">
                    drop
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
