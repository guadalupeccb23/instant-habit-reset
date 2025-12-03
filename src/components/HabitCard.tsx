import { useState, useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  isEnabled: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onToggle: (id: string, enabled: boolean) => void;
  delay?: number;
}

const HabitCard = ({
  id,
  title,
  description,
  icon,
  colorClass,
  isEnabled,
  isDisabled = false,
  disabledReason,
  onToggle,
  delay = 0,
}: HabitCardProps) => {
  const [showCheck, setShowCheck] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isDisabled) return;
    
    const newState = !isEnabled;
    setIsAnimating(true);
    
    if (newState) {
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 600);
    }
    
    onToggle(id, newState);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 transition-all duration-300 animate-fade-in",
        colorClass,
        isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-soft active:scale-[0.98]",
        isEnabled && !isDisabled && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleToggle}
    >
      {/* Check animation overlay */}
      {showCheck && (
        <div className="absolute inset-0 flex items-center justify-center bg-success/20 backdrop-blur-sm z-10 rounded-2xl">
          <div className="bg-success rounded-full p-3 animate-check-bounce shadow-toggle">
            <Check className="w-8 h-8 text-success-foreground" strokeWidth={3} />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            "p-2.5 rounded-xl transition-colors duration-200",
            isEnabled ? "bg-primary/20" : "bg-foreground/10"
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{description}</p>
          </div>
        </div>

        {/* Toggle switch */}
        <div
          className={cn(
            "relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0",
            isEnabled ? "bg-primary shadow-toggle" : "bg-muted",
            isDisabled && "bg-muted/50"
          )}
        >
          <div
            className={cn(
              "absolute top-1 w-6 h-6 rounded-full bg-card shadow-md transition-all duration-300 flex items-center justify-center",
              isEnabled ? "left-7" : "left-1",
              isAnimating && "scale-90"
            )}
          >
            {isEnabled ? (
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
            )}
          </div>
        </div>
      </div>

      {/* Disabled reason */}
      {isDisabled && disabledReason && (
        <div className="mt-3 flex items-center gap-2 text-xs text-warning-foreground bg-warning/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{disabledReason}</span>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
