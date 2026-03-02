interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatFn: (val: number) => string;
  onChange: (val: number) => void;
  accentColor?: string;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  formatFn,
  onChange,
  accentColor = "var(--teal)"
}: SliderControlProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-3">
        <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </label>
        <span 
          className="text-sm font-mono font-bold"
          style={{ color: `hsl(${accentColor})` }}
        >
          {formatFn(value)}
        </span>
      </div>
      
      <div className="relative group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full relative z-10"
        />
        {/* Visual progress track underneath */}
        <div 
          className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none transition-all duration-200"
          style={{ 
            width: `${((value - min) / (max - min)) * 100}%`,
            backgroundColor: `hsl(${accentColor} / 0.3)`
          }}
        />
      </div>
    </div>
  );
}
