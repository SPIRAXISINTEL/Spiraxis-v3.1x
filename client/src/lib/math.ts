/**
 * Mathematical utility functions for the Spiraxis Crash Shield model
 */

// Factorial (n!)
export const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

// Combinations (n choose k)
export const C_nk = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

// Binomial Probability Mass Function: P(X = k)
export const binomialPMF = (n: number, k: number, p: number): number => {
  return C_nk(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

// Probability of at least k successes (Crash Probability)
export const crashProb = (n: number, k: number, p: number): number => {
  let pLess = 0;
  for (let i = 0; i < k; i++) {
    pLess += binomialPMF(n, i, p);
  }
  return 1 - pLess;
};

// ─── PLACEMENT TYPES ────────────────────────────────────────────────────
export const PLACEMENTS = [
  { id:"epargne", label:"Épargne Assurance", short:"ÉPAR", quadrant:"Q1",
    risk:"Faible", returnLevel:"Modéré", color:"#2dbfb0", icon:"🛡",
    annualReturn:[0.025,0.05], volatility:0.002, liquidityDays:[0,1],
    description:"Fonds garantis, capital protégé, rendement 2.5–5%/an. Disponible J+0 à J+1." },
  { id:"opcvm", label:"OPCVM Obligataire", short:"OPCVM", quadrant:"Q2",
    risk:"Faible", returnLevel:"Modéré+", color:"#58a6ff", icon:"📊",
    annualReturn:[0.04,0.07], volatility:0.004, liquidityDays:[1,3],
    description:"Fonds commun de placement, obligations. Rendement 4–7%/an. Liquide J+1 à J+3." },
  { id:"masi", label:"Actions MASI", short:"MASI", quadrant:"Q3",
    risk:"Modéré", returnLevel:"Élevé", color:"#c9a84c", icon:"📈",
    annualReturn:[0.06,0.18], volatility:0.015, liquidityDays:[1,3],
    description:"Sociétés cotées BVC (ATW, IAM, MNG, BCP). Rendement 6–18%/an. Liquide J+1 à J+3." },
  { id:"crypto", label:"Crypto / Bitcoin", short:"CRYP", quadrant:"Q4",
    risk:"Modéré-Élevé", returnLevel:"Très Élevé", color:"#f85149", icon:"₿",
    annualReturn:[0.08,0.45], volatility:0.035, liquidityDays:[0,1],
    description:"Actifs numériques. Rendement 8–45%/an avec forte volatilité. Liquide J+0 à J+1." },
];

export const HIST = [
  {"date":"16/01/2017","ATW":440.0,"IAM":152.2,"MNG":1015.0,"LHM":2580.0,"BCP":326.0,"MASI":12576.9549},
  {"date":"19/01/2017","ATW":433.0,"IAM":153.5,"MNG":1010.0,"LHM":2500.0,"BCP":311.15,"MASI":12425.0963},
  {"date":"24/01/2017","ATW":429.1,"IAM":155.0,"MNG":1045.0,"LHM":2588.0,"BCP":309.4,"MASI":12484.2272},
  {"date":"27/01/2017","ATW":429.4,"IAM":154.0,"MNG":1088.0,"LHM":2600.0,"BCP":310.0,"MASI":12507.9939},
  {"date":"01/02/2017","ATW":411.2,"IAM":150.05,"MNG":1150.0,"LHM":2600.0,"BCP":288.9,"MASI":12163.6391},
  {"date":"06/02/2017","ATW":428.95,"IAM":147.8,"MNG":1175.0,"LHM":2580.0,"BCP":303.8,"MASI":12247.6579},
  {"date":"09/02/2017","ATW":430.05,"IAM":148.5,"MNG":1150.0,"LHM":2565.0,"BCP":307.0,"MASI":12287.112},
  {"date":"14/02/2017","ATW":427.0,"IAM":147.0,"MNG":1240.0,"LHM":2550.0,"BCP":304.8,"MASI":12277.5714},
  {"date":"17/02/2017","ATW":425.1,"IAM":146.1,"MNG":1175.0,"LHM":2550.0,"BCP":301.55,"MASI":12165.0668},
  {"date":"22/02/2017","ATW":414.0,"IAM":140.0,"MNG":1161.0,"LHM":2560.0,"BCP":288.0,"MASI":11954.085},
  {"date":"27/02/2017","ATW":412.0,"IAM":142.0,"MNG":1140.0,"LHM":2520.0,"BCP":280.0,"MASI":11822.1983},
  {"date":"02/03/2017","ATW":425.0,"IAM":144.95,"MNG":1210.0,"LHM":2550.0,"BCP":279.0,"MASI":11967.2367},
  {"date":"07/03/2017","ATW":427.0,"IAM":143.0,"MNG":1225.0,"LHM":2568.0,"BCP":271.0,"MASI":11946.1135},
  {"date":"10/03/2017","ATW":425.5,"IAM":143.1,"MNG":1299.0,"LHM":2530.0,"BCP":270.0,"MASI":11935.0257},
  {"date":"15/03/2017","ATW":424.9,"IAM":142.6,"MNG":1372.0,"LHM":2530.0,"BCP":274.0,"MASI":11995.3805},
  {"date":"31/03/2017","ATW":400.0,"IAM":137.3,"MNG":1110.0,"LHM":2160.0,"BCP":263.25,"MASI":11379.7117},
  {"date":"02/05/2017","ATW":419.3,"IAM":139.0,"MNG":1250.0,"LHM":2305.0,"BCP":285.0,"MASI":11825.6642},
  {"date":"08/06/2017","ATW":439.9,"IAM":134.2,"MNG":1350.0,"LHM":2029.0,"BCP":291.0,"MASI":11756.7385},
  {"date":"28/06/2017","ATW":450.0,"IAM":141.5,"MNG":1327.0,"LHM":2074.0,"BCP":299.8,"MASI":12041.8486},
  {"date":"11/07/2017","ATW":449.0,"IAM":139.0,"MNG":1320.0,"LHM":2350.0,"BCP":300.0,"MASI":12100.0}
];
