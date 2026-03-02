import { SimDataPoint } from "@/hooks/use-simulation";

interface TimelineChartProps {
  data: SimDataPoint[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex h-8 rounded-lg overflow-hidden border border-border shadow-inner">
        {data.map((d, i) => {
          const colors = [
            "hsl(var(--surface-hover))", // Nominal (quiet bg)
            "hsl(var(--yellow))",        // Vigilance
            "hsl(var(--orange))",        // Alerte
            "hsl(var(--red))"            // Crash
          ];
          return (
            <div
              key={i}
              className="flex-1 transition-colors duration-300 hover:brightness-125"
              style={{ background: colors[d.alert] }}
              title={`Day ${d.day}: Alert Level ${d.alert} | DD: -${d.drawdown}%`}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between mt-3 text-xs font-mono text-text-muted">
        <span>Day 0</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(var(--surface-hover))] border border-border" /> Nominal</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(var(--yellow))]" /> Vig.</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(var(--orange))]" /> Alerte</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(var(--red))]" /> Crash</span>
        </div>
        <span>Day {data[data.length - 1]?.day || 0}</span>
      </div>
    </div>
  );
}
