import { SimDataPoint } from "@/hooks/use-simulation";

interface CapitalChartProps {
  data: SimDataPoint[];
}

export function CapitalChart({ data }: CapitalChartProps) {
  if (data.length < 2) return null;

  const vals = data.map((d) => d.capital);
  const floors = data.map((d) => d.plancher);
  const minV = Math.min(...vals) * 0.95;
  const maxV = Math.max(...floors, ...vals) * 1.02;
  
  const W = 900;
  const H = 240; // Taller for more presence
  
  const toX = (i: number) => (i / (data.length - 1)) * W;
  const toY = (v: number) => H - ((v - minV) / (maxV - minV)) * H;

  const capitalPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.capital)}`).join(" ");
  const floorPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.plancher)}`).join(" ");

  // Y-axis labels
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-surface/50 relative">
      {/* Decorative gradient blur in background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal/5 to-transparent pointer-events-none" />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${W + 40} ${H + 30}`} 
        preserveAspectRatio="none"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={0.15} />
            <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0} />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.5"/>
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Alert level zones background */}
        {data.map((d, i) => {
          if (d.alert < 1) return null;
          const colors = ["transparent", "hsl(var(--yellow)/0.05)", "hsl(var(--orange)/0.1)", "hsl(var(--red)/0.15)"];
          return (
            <rect 
              key={`a${i}`} 
              x={toX(i) - 1} 
              y={0} 
              width={W / data.length + 2} 
              height={H} 
              fill={colors[d.alert]} 
            />
          );
        })}

        {/* Crash vertical marker lines */}
        {data.map((d, i) => {
          if (!d.crash) return null;
          return (
            <line 
              key={`c${i}`} 
              x1={toX(i)} y1={0} x2={toX(i)} y2={H} 
              stroke="hsl(var(--red))" strokeOpacity="0.3" strokeWidth={2}
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Floor area and line */}
        <path d={`${floorPath} L${W},${H} L0,${H} Z`} fill="url(#floorGrad)" />
        <path 
          d={floorPath} 
          fill="none" 
          stroke="hsl(var(--teal))" 
          strokeWidth={2} 
          strokeDasharray="4,4" 
          style={{ filter: "drop-shadow(0px 2px 4px hsl(var(--teal)/0.3))" }}
        />

        {/* Capital area and line */}
        <path d={`${capitalPath} L${W},${H} L0,${H} Z`} fill="url(#capGrad)" />
        <path 
          d={capitalPath} 
          fill="none" 
          stroke="hsl(var(--gold))" 
          strokeWidth={2.5}
          style={{ filter: "drop-shadow(0px 4px 6px hsl(var(--gold)/0.4))" }}
        />

        {/* Y-axis text labels */}
        {yAxisTicks.map((r, i) => {
          const v = minV + r * (maxV - minV);
          return (
            <text 
              key={i} 
              x={W + 5} 
              y={toY(v) + 4} 
              fill="hsl(var(--text-muted))" 
              fontSize={11} 
              fontFamily="var(--font-mono)"
            >
              {(v / 1000).toFixed(0)}k
            </text>
          );
        })}
      </svg>
    </div>
  );
}
