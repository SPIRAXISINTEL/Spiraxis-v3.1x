import { useState, useEffect } from "react";
import { useSimulation } from "@/hooks/use-simulation";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AlertBadge } from "@/components/dashboard/alert-badge";
import { SliderControl } from "@/components/dashboard/slider-control";
import { CapitalChart } from "@/components/dashboard/capital-chart";
import { TimelineChart } from "@/components/dashboard/timeline-chart";
import { BinomialVisualizer } from "@/components/dashboard/binomial-visualizer";
import { BestDaysTab } from "@/components/dashboard/best-days-tab";
import { Activity, ShieldAlert, Settings2, BarChart3, Database, Layers, ArrowRightLeft, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "shield" | "binomial" | "alerts" | "recovery" | "bestdays";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("shield");
  const [liveAlert, setLiveAlert] = useState(0);

  const sim = useSimulation({
    capital: 610000,
    horizon: 120,
    pBaisse: 0.45,
    nSeances: 10,
    kSeuil: 7,
    alloc: [40, 30, 20, 10],
  });

  const { config, derived, data, regenerate } = sim;

  const last = data[data.length - 1] || {
    capital: config.capital,
    plancher: config.capital,
    drawdown: 0,
    alert: 0,
  };

  const crashDays = data.filter((d) => d.alert === 3).length;
  const recoveryRate = (((config.horizon - crashDays) / config.horizon) * 100).toFixed(1);
  const alertEvents = data.filter(d => d.alert === 2).length;
  const surveillerEvents = data.filter(d => d.alert === 1).length;
  const totalEvents = data.filter(d => d.alert > 0).length;

  const maxDrawdown = Math.max(...data.map(d => d.drawdown));
  const capitalProtege = (last.plancher * 0.96).toFixed(1);
  const bouclierEfficacite = ((1 - (maxDrawdown / 100)) * 600).toFixed(0);

  const logs = data.filter(d => d.alert > 0).reverse();

  const navItems = [
    { id: "shield", label: "CRASH SHIELD", icon: Activity },
    { id: "binomial", label: "MODÈLE Bₙₚ", icon: BarChart3 },
    { id: "alerts", label: `ALERTES (${totalEvents})`, icon: Database },
    { id: "recovery", label: "RECOVERY", icon: Layers },
    { id: "bestdays", label: "OPTIMISATION", icon: Target },
  ];

  const getAlertColor = (lvl: number) => {
    if (lvl === 3) return "text-red border-red bg-red/10";
    if (lvl === 2) return "text-orange border-orange bg-orange/10";
    if (lvl === 1) return "text-yellow border-yellow bg-yellow/10";
    return "text-green border-green bg-green/10";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (data.length > 0) {
        const recent = data.slice(-20);
        if (recent.length > 0) {
          const randDay = recent[Math.floor(Math.random() * recent.length)];
          setLiveAlert(randDay.alert);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 glass-panel border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teal p-0.5 shadow-lg shadow-teal/20">
              <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
                <ShieldAlert size={20} className="text-teal" />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
                SPIRAXIS CRASH SHIELD
              </h1>
              <p className="text-[10px] font-mono tracking-[0.2em] text-text-muted">
                QUANTITATIVE RISK MODEL · V2.0
              </p>
            </div>
          </div>

          <nav className="flex bg-surface-hover p-1 rounded-xl border border-border/50">
            {navItems.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabId)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-200
                  ${activeTab === t.id 
                    ? "bg-surface text-teal shadow-md border border-teal/20" 
                    : "text-text-muted hover:text-foreground hover:bg-surface/50"}
                `}
              >
                <t.icon size={14} />
                <span className="hidden sm:inline uppercase">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <AlertBadge level={liveAlert} pulse />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === "shield" && (
            <motion.div
              key="shield"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <AnimatePresence>
                {last.alert === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-6 rounded-2xl bg-red/10 border border-red/30 shadow-[0_0_30px_rgba(248,81,73,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjQ4LCA4MSwgNzMsIDAuMSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_right,white,transparent)]" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-red/20 rounded-full animate-pulse-ring">
                        <ShieldAlert className="text-red w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-red font-bold tracking-widest uppercase">Protocol Bouclier Activé</h3>
                        <p className="text-red/70 text-sm mt-1">Plancher ratchet maintenu. Capital protégé.</p>
                      </div>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="text-3xl font-mono font-bold text-red">-{last.drawdown}%</div>
                      <div className="text-xs text-red/60 font-bold tracking-wider">DRAWDOWN</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard label="Capital Final" value={`${(last.capital / 1000).toFixed(1)}k`} subValue="MAD" colorVar="--gold" delay={0.1} />
                <KpiCard label="Plancher Ratchet" value={`${(last.plancher / 1000).toFixed(1)}k`} subValue="Capital Garanti" colorVar="--teal" delay={0.2} />
                <KpiCard label="Max Drawdown" value={`-${maxDrawdown.toFixed(1)}%`} subValue="vs Plancher" colorVar={last.drawdown > 5 ? "--red" : "--orange"} delay={0.3} />
                <KpiCard label="Jours Crash" value={crashDays} subValue={`sur ${config.horizon} jours`} colorVar="--red" delay={0.4} />
                <KpiCard label="Taux Nominal" value={`${recoveryRate}%`} subValue="Temps hors crash" colorVar="--green" delay={0.5} />
              </div>

              <div className="grid lg:grid-cols-[340px_1fr] gap-6">
                <div className="glass-panel rounded-2xl p-6 h-fit border-gradient">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold tracking-widest text-text-muted flex items-center gap-2"><Settings2 size={16} /> PARAMÈTRES</h3>
                    <button onClick={regenerate} className="p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-teal hover:text-gold transition-colors shadow-sm" title="Rerun Simulation"><ArrowRightLeft size={16} /></button>
                  </div>
                  <SliderControl label="Capital Initial" value={config.capital} min={10000} max={1000000} step={10000} formatFn={(v) => `${(v/1000).toFixed(0)}k MAD`} onChange={config.setCapital} accentColor="--gold" />
                  <SliderControl label="Horizon (Jours)" value={config.horizon} min={30} max={365} step={10} formatFn={(v) => `${v}j`} onChange={config.setHorizon} />
                  <SliderControl label="P(Baisse Journalière)" value={config.pBaisse} min={0.1} max={0.7} step={0.01} formatFn={(v) => `${(v*100).toFixed(0)}%`} onChange={config.setPBaisse} />
                  <SliderControl label="Fenêtre (Séances)" value={config.nSeances} min={5} max={20} step={1} formatFn={(v) => `${v}`} onChange={config.setNSeances} accentColor="--orange" />
                  <SliderControl label="Seuil Déclencheur (K)" value={config.kSeuil} min={2} max={config.nSeances} step={1} formatFn={(v) => `K = ${v}`} onChange={config.setKSeuil} accentColor="--red" />
                  <div className="mt-8 p-5 rounded-xl bg-surface border border-border shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Layers size={64} /></div>
                    <div className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Probabilité de Crash</div>
                    <div className="text-4xl font-mono font-bold tracking-tighter" style={{ color: derived.crashP > 0.5 ? 'hsl(var(--red))' : 'hsl(var(--teal))' }}>{(derived.crashP * 100).toFixed(1)}%</div>
                    <div className="h-2 w-full bg-surface-hover rounded-full mt-4 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: derived.crashP > 0.5 ? 'hsl(var(--red))' : 'hsl(var(--teal))' }} initial={{ width: 0 }} animate={{ width: `${derived.crashP * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
                    </div>
                    <p className="text-[10px] text-text-faint mt-3 font-mono">Loi B({config.nSeances}, {(config.pBaisse*100).toFixed(0)}%) ≥ {config.kSeuil}</p>
                  </div>
                </div>
                <div className="space-y-6 flex flex-col">
                  <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="font-serif text-xl text-foreground mb-1">Trajectoire & Protection</h2>
                        <p className="text-xs text-text-muted">Capital vs Plancher Garanti avec Zones de Crash</p>
                      </div>
                      <div className="flex gap-4 text-xs font-mono">
                        <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-gold" /> Capital</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-teal border-b border-dashed border-background" /> Plancher</span>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[300px]"><CapitalChart data={data} /></div>
                  </div>
                  <div className="glass-panel rounded-2xl p-6"><h3 className="font-serif text-lg text-foreground mb-4">Timeline des Alertes</h3><TimelineChart data={data} /></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "binomial" && (
            <motion.div key="binomial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Le Moteur Mathématique</h2>
                <p className="text-text-muted">Fondé sur la loi binomiale, le Crash Shield évalue la probabilité d'une succession anormale de baisses sur une fenêtre glissante.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-2xl p-8 border-gradient">
                  <h3 className="text-xs font-bold tracking-widest text-text-muted mb-6">LA FORMULE</h3>
                  <div className="py-10 text-center border-y border-border/50 mb-8 bg-surface/30 rounded-xl">
                    <div className="text-2xl font-serif text-gold mb-4">P(X = k)</div>
                    <div className="text-4xl md:text-5xl font-serif text-teal tracking-wider">C<sub className="text-2xl">n</sub><sup className="text-2xl">k</sup> · p<sup className="text-2xl">k</sup> · (1-p)<sup className="text-2xl">n-k</sup></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface p-4 rounded-xl border-l-2 border-teal"><div className="text-lg font-bold font-serif text-foreground">{config.nSeances} séances</div><div className="text-[10px] text-text-muted uppercase tracking-wider">Fenêtre d'observation</div></div>
                    <div className="bg-surface p-4 rounded-xl border-l-2 border-red"><div className="text-lg font-bold font-serif text-foreground">k = ≥ {config.kSeuil} baisses</div><div className="text-[10px] text-text-muted uppercase tracking-wider">Seuil déclencheur</div></div>
                    <div className="bg-surface p-4 rounded-xl border-l-2 border-gold"><div className="text-lg font-bold font-serif text-foreground">p = {(config.pBaisse*100).toFixed(0)}%</div><div className="text-[10px] text-text-muted uppercase tracking-wider">P(baisse journalière)</div></div>
                    <div className="bg-surface p-4 rounded-xl border-l-2 border-text-muted"><div className="text-lg font-bold font-serif text-foreground">C<sub className="text-xs">n</sub><sup className="text-xs">k</sup> = {derived.combinations.toFixed(0)}</div><div className="text-[10px] text-text-muted uppercase tracking-wider">Combinaisons</div></div>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-8 flex flex-col">
                  <h3 className="text-xs font-bold tracking-widest text-text-muted mb-2">DISTRIBUTION DE PROBABILITÉ</h3>
                  <p className="text-sm text-text-faint mb-6">Visualisation de la loi binomiale B({config.nSeances}, {config.pBaisse})</p>
                  <div className="flex-1 mt-auto"><BinomialVisualizer n={config.nSeances} k={config.kSeuil} p={config.pBaisse} crashP={derived.crashP} /></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "alerts" && (
            <motion.div key="alerts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-[1fr_320px] gap-8">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div><h2 className="text-3xl font-serif font-bold">Journal des Alertes</h2><p className="text-text-muted">{totalEvents} événements détectés sur {config.horizon} jours</p></div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-surface border border-border rounded-lg text-center min-w-[80px]"><div className="text-xl font-mono text-yellow font-bold">{surveillerEvents}</div><div className="text-[9px] text-text-muted uppercase">Surveiller</div></div>
                    <div className="px-4 py-2 bg-surface border border-border rounded-lg text-center min-w-[80px]"><div className="text-xl font-mono text-orange font-bold">{alertEvents}</div><div className="text-[9px] text-text-muted uppercase">Alerte</div></div>
                    <div className="px-4 py-2 bg-surface border border-border rounded-lg text-center min-w-[80px]"><div className="text-xl font-mono text-red font-bold">{crashDays}</div><div className="text-[9px] text-text-muted uppercase">Crash</div></div>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl overflow-hidden border-border/40">
                  <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {logs.map((entry, idx) => (
                      <motion.div key={`${entry.day}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl border-l-4 flex items-center justify-between ${getAlertColor(entry.alert)}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          <div>
                            <div className="font-bold text-sm">Jour {entry.day} — {entry.alert === 3 ? 'CRASH DÉTECTÉ' : entry.alert === 2 ? 'ALERTE' : 'SURVEILLER'}</div>
                            <div className="text-[10px] opacity-70 font-mono">Capital: {(entry.capital / 1000).toFixed(1)}k MAD · Drawdown: {entry.drawdown.toFixed(1)}% · Consec: {entry.consecutive}</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-lg opacity-80">{(entry.crashProb * 100).toFixed(1)}%</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <aside className="space-y-6">
                <div className="glass-panel rounded-2xl p-6 border-gradient">
                  <h3 className="text-xs font-bold tracking-widest text-gold mb-6 uppercase">Règles du Bouclier</h3>
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="text-[10px] font-bold text-yellow uppercase">Surveiller</div><p className="text-[11px] text-text-muted leading-relaxed">Condition: 2 baisses consécutives OU drawdown {'>'} 4%</p><div className="text-[11px] text-yellow">→ Réduire Vitesse 50%</div></div>
                    <div className="space-y-2 pt-4 border-t border-border/30"><div className="text-[10px] font-bold text-orange uppercase">Alerte</div><p className="text-[11px] text-text-muted leading-relaxed">Condition: 3 baisses consécutives OU drawdown {'>'} 8%</p><div className="text-[11px] text-orange">→ Activer stop-loss partiel</div></div>
                    <div className="space-y-2 pt-4 border-t border-border/30"><div className="text-[10px] font-bold text-red uppercase">Crash Détecté</div><p className="text-[11px] text-text-muted leading-relaxed">Condition: K≥4 baisses OU drawdown {'>'} 15%</p><div className="text-[11px] text-red font-bold">→ RECENTRER sur cœur stable</div></div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {activeTab === "recovery" && (
            <motion.div key="recovery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="max-w-3xl"><h2 className="text-3xl font-serif font-bold">Protocole Recovery Spirale</h2><p className="text-text-muted">Remontée optimale après crash — Bouclier φ actif</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "PHASE 1 — DÉTECTION", condition: "Condition: K ≥ 7 baisses sur 10 séances", color: "red", steps: ["P(crash) > 50% déclenché", "Stop-loss à -48% du plancher ratchet", "Fermeture complète couche Vitesse", "Passage en mode Cœur Stable 100%"] },
                  { title: "PHASE 2 — CONSOLIDATION", condition: "Condition: K retombe < seuil · P(crash) < 30%", color: "orange", steps: ["Réintégration couche Actif MASI 15%", "Surveillance ATR × phi pendant 5 séances", "Validation: volume > moyenne 10j", "Capital doit dépasser plancher ratchet"] },
                  { title: "PHASE 3 — REMONTÉE", condition: "Condition: 3 séances haussières consécutives", color: "gold", steps: ["Réallocation allocation modérée (65/25/10)", "N repart à 0 — cycle spirale reset", "φ réel recalculé sur données fraîches", "Nouveau plancher ratchet enregistré"] },
                  { title: "PHASE 4 — NOMINAL", condition: "Condition: K = 0, P(crash) < 10%", color: "green", steps: ["Protocole standard réactivé", "Allocation cible retrouvée", "Journal P(B(n,p)=k) archivé", "Rapport de crash généré (MAD protégés)"] }
                ].map((phase, i) => (
                  <div key={i} className="glass-panel rounded-2xl p-8 border-t-2" style={{ borderTopColor: `hsl(var(--${phase.color}))` }}>
                    <h3 className="font-bold tracking-widest text-sm mb-1" style={{ color: `hsl(var(--${phase.color}))` }}>{phase.title}</h3>
                    <p className="text-[10px] text-text-muted italic mb-6">{phase.condition}</p>
                    <div className="space-y-4">
                      {phase.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0 mt-0.5">{idx + 1}</div>
                          <p className="text-xs text-text-muted leading-tight">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "bestdays" && (
            <motion.div key="bestdays" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <BestDaysTab simData={data} capital={config.capital} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
