import { Shield, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AlertBadgeProps {
  level: number;
  pulse?: boolean;
}

export function AlertBadge({ level, pulse = false }: AlertBadgeProps) {
  const levels = [
    { label: "NOMINAL", color: "var(--green)", bg: "var(--green)", icon: CheckCircle2 },
    { label: "VIGILANCE", color: "var(--yellow)", bg: "var(--yellow)", icon: AlertTriangle },
    { label: "ALERTE", color: "var(--orange)", bg: "var(--orange)", icon: AlertOctagon },
    { label: "CRASH", color: "var(--red)", bg: "var(--red)", icon: Shield },
  ];

  const current = levels[Math.min(level, 3)] || levels[0];
  const Icon = current.icon;

  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-surface text-xs font-bold tracking-wider"
        style={{ color: `hsl(${current.color})` }}
      >
        <Icon size={14} />
        {current.label}
      </div>
      
      {pulse && (
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-2.5 h-2.5 rounded-full"
          style={{ 
            backgroundColor: `hsl(${current.color})`,
            boxShadow: `0 0 10px hsl(${current.color} / 0.5)`
          }}
        />
      )}
    </div>
  );
}
