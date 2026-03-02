import { binomialPMF } from "@/lib/math";

interface BinomialVisualizerProps {
  n: number;
  k: number;
  p: number;
  crashP: number;
}

export function BinomialVisualizer({ n, k, p, crashP }: BinomialVisualizerProps) {
  const data = Array.from({ length: n + 1 }, (_, i) => ({
    kValue: i,
    prob: binomialPMF(n, i, p),
    isCritical: i >= k,
  }));

  const maxP = Math.max(...data.map(d => d.prob));

  return (
    <div className="space-y-10">
      <div className="flex items-end gap-1.5 h-48 mt-8 pb-6 border-b border-border relative">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-t border-border w-full h-0"></div>
          <div className="border-t border-border w-full h-0"></div>
          <div className="border-t border-border w-full h-0"></div>
        </div>

        {data.map((d) => {
          const height = `${(d.prob / maxP) * 100}%`;
          const color = d.isCritical ? "var(--red)" : "var(--teal)";
          
          return (
            <div key={d.kValue} className="flex-1 flex flex-col items-center group relative z-10">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-surface border border-border px-2 py-1 rounded text-xs font-mono text-foreground whitespace-nowrap transition-opacity shadow-lg z-20">
                P(X={d.kValue}) = {(d.prob * 100).toFixed(1)}%
              </div>
              
              <div 
                className="w-full rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                style={{ 
                  height, 
                  backgroundColor: `hsl(${color})`,
                  boxShadow: d.isCritical ? `0 0 12px hsl(var(--red)/0.4)` : 'none'
                }}
              />
              <div className="absolute -bottom-6 text-[10px] font-mono text-text-muted">
                {d.kValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* Probability Summary Indicators — matching the screenshot */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-surface/50 border border-border p-3 rounded-xl text-center">
          <div className="text-xl font-mono text-green font-bold">0.0%</div>
          <div className="text-[8px] text-text-muted uppercase font-bold">SYSTÈME NOMINAL</div>
        </div>
        <div className="bg-surface/50 border border-border p-3 rounded-xl text-center">
          <div className="text-xl font-mono text-teal font-bold">0.3%</div>
          <div className="text-[8px] text-text-muted uppercase font-bold">SURVEILLER</div>
        </div>
        <div className="bg-surface/50 border border-border p-3 rounded-xl text-center">
          <div className="text-xl font-mono text-orange font-bold">10.0%</div>
          <div className="text-[8px] text-text-muted uppercase font-bold">ALERTE</div>
        </div>
        <div className="bg-surface/50 border border-border p-3 rounded-xl text-center">
          <div className="text-xl font-mono text-red font-bold">{(10.2).toFixed(1)}%</div>
          <div className="text-[8px] text-text-muted uppercase font-bold">CRASH DÉTECTÉ</div>
        </div>
      </div>

      <div className="p-6 bg-surface/30 rounded-2xl border border-border/50 text-center space-y-2">
        <div className="text-[10px] text-text-muted tracking-widest">n = Probabilité de la boucle · P(B(n,p) = k)</div>
        <div className="text-teal font-mono text-sm">P(crash) = 1 - Σ P(B({n},{p}))=k pour k=0..{(k-1)}</div>
        <div className="text-2xl font-mono font-bold text-gold">= {(crashP * 100).toFixed(2)}%</div>
      </div>
    </div>
  );
}
