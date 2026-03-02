import { useState, useMemo } from "react";
import { PLACEMENTS, HIST } from "@/lib/math";
import { SimDataPoint } from "@/hooks/use-simulation";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, Clock, BarChart2 } from "lucide-react";

interface BestDaysTabProps {
  simData: SimDataPoint[];
  capital: number;
}

export function BestDaysTab({ simData, capital }: BestDaysTabProps) {
  const [selectedPlacement, setSelectedPlacement] = useState(0);

  const analysis = useMemo(() => {
    return PLACEMENTS.map((p, pIdx) => {
      // Day-of-week analysis
      const dowReturns = [0, 1, 2, 3, 4].map(dow => {
        const days = simData.filter(d => (d.day % 5) === dow);
        const avg = days.length
          ? days.reduce((s, d) => s + (d.returns?.[pIdx] || 0), 0) / days.length
          : 0;
        return { dow, avg, count: days.length };
      });
      const DOW_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
      const bestDepositDow = dowReturns.reduce((a, b) => a.avg < b.avg ? a : b);
      const bestWithdrawDow = dowReturns.reduce((a, b) => a.avg > b.avg ? a : b);

      // Month-of-year from HIST
      const monthBuckets: Record<number, number[]> = {};
      HIST.forEach((row, i) => {
        if (i === 0) return;
        const prev = HIST[i - 1];
        const month = parseInt(row.date.split("/")[1]);
        const r = (row.MASI - (prev as any).MASI) / (prev as any).MASI * 100;
        if (!monthBuckets[month]) monthBuckets[month] = [];
        monthBuckets[month].push(r);
      });
      const MONTH_NAMES = ["", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
      const monthStats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({
        month: m,
        label: MONTH_NAMES[m],
        avg: monthBuckets[m] ? monthBuckets[m].reduce((s, r) => s + r, 0) / monthBuckets[m].length : 0
      }));
      const bestDepositMonth = monthStats.reduce((a, b) => a.avg < b.avg ? a : b);
      const bestWithdrawMonth = monthStats.reduce((a, b) => a.avg > b.avg ? a : b);

      return {
        placement: p,
        dowReturns: dowReturns.map((d, i) => ({ ...d, label: DOW_LABELS[i] })),
        bestDepositDow: { ...bestDepositDow, label: DOW_LABELS[bestDepositDow.dow] },
        bestWithdrawDow: { ...bestWithdrawDow, label: DOW_LABELS[bestWithdrawDow.dow] },
        monthStats,
        bestDepositMonth,
        bestWithdrawMonth
      };
    });
  }, [simData]);

  const A = analysis[selectedPlacement];
  const p = A.placement;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold">Meilleurs Jours — Dépôt & Retrait</h2>
          <p className="text-text-muted">Analyse statistique par type de placement pour maximiser vos entrées et sorties.</p>
        </div>
      </div>

      {/* Placement Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PLACEMENTS.map((pl, i) => (
          <button
            key={pl.id}
            onClick={() => setSelectedPlacement(i)}
            className={`p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group ${
              selectedPlacement === i 
                ? "bg-surface border-teal/50 shadow-lg shadow-teal/5" 
                : "bg-surface/40 border-border hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <span className="text-2xl">{pl.icon}</span>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${selectedPlacement === i ? 'text-teal' : 'text-text-muted'}`}>
                {pl.short}
              </span>
            </div>
            <div className={`text-xs font-bold relative z-10 ${selectedPlacement === i ? 'text-foreground' : 'text-text-muted'}`}>
              {pl.label}
            </div>
            {selectedPlacement === i && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent pointer-events-none" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Verdict Cards */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-teal">
            <h3 className="text-xs font-bold tracking-widest text-teal mb-6 flex items-center gap-2">
              <TrendingDown size={14} /> ✅ MEILLEUR DÉPÔT (PRIX BAS)
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-3 bg-surface/50 rounded-xl border border-border/50">
                <Calendar className="text-teal" size={20} />
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Jour de semaine</div>
                  <div className="text-lg font-bold text-foreground">{A.bestDepositDow.label}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-text-muted">Rend. moyen</div>
                  <div className="text-teal font-mono font-bold text-sm">{A.bestDepositDow.avg.toFixed(3)}%</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-surface/50 rounded-xl border border-border/50">
                <Clock className="text-teal" size={20} />
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Meilleur mois</div>
                  <div className="text-lg font-bold text-foreground">{A.bestDepositMonth.label}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-text-muted">Moy. historique</div>
                  <div className="text-teal font-mono font-bold text-sm">{A.bestDepositMonth.avg.toFixed(3)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-gold">
            <h3 className="text-xs font-bold tracking-widest text-gold mb-6 flex items-center gap-2">
              <TrendingUp size={14} /> 💰 MEILLEUR RETRAIT (PRIX HAUT)
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-3 bg-surface/50 rounded-xl border border-border/50">
                <Calendar className="text-gold" size={20} />
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Jour de semaine</div>
                  <div className="text-lg font-bold text-foreground">{A.bestWithdrawDow.label}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-text-muted">Rend. moyen</div>
                  <div className="text-gold font-mono font-bold text-sm">+{A.bestWithdrawDow.avg.toFixed(3)}%</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-surface/50 rounded-xl border border-border/50">
                <Clock className="text-gold" size={20} />
                <div>
                  <div className="text-[10px] text-text-muted uppercase">Meilleur mois</div>
                  <div className="text-lg font-bold text-foreground">{A.bestWithdrawMonth.label}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-text-muted">Moy. historique</div>
                  <div className="text-gold font-mono font-bold text-sm">+{A.bestWithdrawMonth.avg.toFixed(3)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-gradient">
            <h3 className="text-xs font-bold tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <BarChart2 size={14} /> RENDEMENT PAR JOUR
            </h3>
            <div className="space-y-4">
              {A.dowReturns.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-medium text-foreground">{d.label}</span>
                    <span className={`text-[10px] font-mono font-bold ${d.avg >= 0 ? 'text-green' : 'text-red'}`}>
                      {d.avg > 0 ? '+' : ''}{d.avg.toFixed(3)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(d.avg) * 50, 100)}%` }}
                      className={`h-full rounded-full ${d.avg >= 0 ? 'bg-green' : 'bg-red'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-bold tracking-widest text-text-muted mb-6 flex items-center gap-2">
              <Calendar size={14} /> SAISONNALITÉ MENSUELLE
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {A.monthStats.map((m, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    m.avg < 0 ? 'bg-teal/5 border-teal/20' : 'bg-gold/5 border-gold/20'
                  }`}
                >
                  <div className="text-[9px] font-bold text-text-muted uppercase">{m.label}</div>
                  <div className={`text-[10px] font-mono font-bold mt-1 ${m.avg < 0 ? 'text-teal' : 'text-gold'}`}>
                    {m.avg > 0 ? '+' : ''}{m.avg.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
