import { ReactNode } from "react";
import { motion } from "framer-motion";

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  colorVar: string; // e.g. "var(--gold)"
  icon?: ReactNode;
  delay?: number;
}

export function KpiCard({ label, value, subValue, colorVar, icon, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface hover:bg-surface-hover transition-colors duration-300 shadow-lg hover:shadow-xl group"
    >
      {/* Top Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, hsl(${colorVar}), transparent)` }}
      />
      
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] md:text-xs font-bold tracking-widest text-text-muted uppercase">
            {label}
          </div>
          {icon && (
            <div className="text-text-muted group-hover:text-foreground transition-colors" style={{ color: `hsl(${colorVar})` }}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <motion.div 
            key={String(value)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight"
            style={{ color: `hsl(${colorVar})` }}
          >
            {value}
          </motion.div>
        </div>
        
        {subValue && (
          <div className="mt-2 text-xs text-text-faint font-medium">
            {subValue}
          </div>
        )}
      </div>

      {/* Subtle background glow on hover */}
      <div 
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ background: `hsl(${colorVar})` }}
      />
    </motion.div>
  );
}
