import { useState, useMemo, useCallback, useEffect } from "react";
import { crashProb, C_nk, PLACEMENTS, HIST } from "@/lib/math";

export interface SimDataPoint {
  day: number;
  capital: number;
  plancher: number;
  baisse: boolean;
  alert: number;
  drawdown: number;
  crash: boolean;
  caps: number[];
  returns: number[];
  consecutive: number;
  crashProb: number;
}

export interface SimConfig {
  capital: number;
  horizon: number;
  pBaisse: number;
  nSeances: number;
  kSeuil: number;
  alloc: number[]; 
}

function dailyReturn(placement: typeof PLACEMENTS[0], day: number, masiRef: typeof HIST) {
  const base = (placement.annualReturn[0] + placement.annualReturn[1]) / 2 / 252;
  const noise = (Math.random() - 0.47) * placement.volatility;
  if (placement.id === "masi" && masiRef) {
    const idx = Math.min(Math.floor(day / 4), masiRef.length - 2);
    const r = (masiRef[idx+1].MASI - masiRef[idx].MASI) / masiRef[idx].MASI / 4;
    return r * 0.6 + noise;
  }
  if (placement.id === "crypto") {
    const trend = Math.sin(day * 0.08) * 0.003;
    return base + noise * 2.5 + trend;
  }
  return base + noise;
}

export function useSimulation(initialConfig: SimConfig) {
  const [capital, setCapital] = useState(initialConfig.capital);
  const [horizon, setHorizon] = useState(initialConfig.horizon);
  const [pBaisse, setPBaisse] = useState(initialConfig.pBaisse);
  const [nSeances, setNSeances] = useState(initialConfig.nSeances);
  const [kSeuil, setKSeuil] = useState(initialConfig.kSeuil);
  const [alloc, setAlloc] = useState(initialConfig.alloc);

  const [simData, setSimData] = useState<SimDataPoint[]>([]);

  const generateSim = useCallback(() => {
    let currentTotal = capital;
    let plancher = capital;
    const caps = alloc.map(a => capital * a / 100);
    const history: SimDataPoint[] = [];
    const baisses: boolean[] = [];
    let consecutiveBaisses = 0;

    for (let day = 0; day <= horizon; day++) {
      if (day === 0) {
        history.push({
          day: 0,
          capital: currentTotal,
          plancher: currentTotal,
          baisse: false,
          alert: 0,
          drawdown: 0,
          crash: false,
          caps: [...caps],
          returns: [0, 0, 0, 0],
          consecutive: 0,
          crashProb: crashProb(nSeances, kSeuil, pBaisse),
        });
        continue;
      }

      const dayReturns = PLACEMENTS.map((p, i) => {
        const r = dailyReturn(p, day, HIST);
        caps[i] *= (1 + r);
        return r;
      });

      currentTotal = caps.reduce((s, c) => s + c, 0);
      
      const isBaisse = currentTotal < history[day - 1].capital;
      baisses.push(isBaisse);
      
      if (isBaisse) {
        consecutiveBaisses++;
      } else {
        consecutiveBaisses = 0;
      }

      const window = baisses.slice(-nSeances);
      const baissesInWindow = window.filter(Boolean).length;
      const currentCrashProb = crashProb(nSeances, kSeuil, pBaisse);

      let alertLvl: 0 | 1 | 2 | 3 = 0;
      const dd = ((plancher - currentTotal) / plancher) * 100;

      if (baissesInWindow >= kSeuil || dd > 15) alertLvl = 3;
      else if (consecutiveBaisses >= 3 || dd > 8) alertLvl = 2;
      else if (consecutiveBaisses >= 2 || dd > 4) alertLvl = 1;

      const isCrash = alertLvl === 3;

      if (!isCrash) {
        if (currentTotal > plancher) plancher = currentTotal;
      }

      if (day % 7 === 0) {
        const newPortions = alloc.map(a => currentTotal * a / 100);
        newPortions.forEach((v, i) => caps[i] = v);
      }

      history.push({
        day,
        capital: currentTotal,
        plancher,
        baisse: isBaisse,
        alert: alertLvl,
        drawdown: Math.max(0, dd),
        crash: isCrash,
        caps: [...caps],
        returns: dayReturns.map(r => r * 100),
        consecutive: consecutiveBaisses,
        crashProb: currentCrashProb,
      });
    }
    setSimData(history);
  }, [capital, horizon, pBaisse, nSeances, kSeuil, alloc]);

  useEffect(() => {
    generateSim();
  }, [generateSim]);

  const derived = useMemo(() => ({
    crashP: crashProb(nSeances, kSeuil, pBaisse),
    safeP: 1 - crashProb(nSeances, kSeuil, pBaisse),
    combinations: C_nk(nSeances, kSeuil),
  }), [nSeances, kSeuil, pBaisse]);

  return {
    config: { 
      capital, setCapital, 
      horizon, setHorizon, 
      pBaisse, setPBaisse, 
      nSeances, setNSeances, 
      kSeuil, setKSeuil,
      alloc, setAlloc
    },
    derived,
    data: simData,
    regenerate: generateSim,
  };
}
