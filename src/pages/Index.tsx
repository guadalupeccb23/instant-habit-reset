import { useState, useEffect } from "react";
import {
  CakeSlice,
  Droplets,
  Dumbbell,
  Cookie,
  Smartphone,
  BookOpen,
  Sparkles,
} from "lucide-react";
import HabitCard from "@/components/HabitCard";
import ReminderPanel from "@/components/ReminderPanel";

interface HabitState {
  id: string;
  enabled: boolean;
}

const STORAGE_KEY = "instant-habit-reset";

const defaultHabits: HabitState[] = [
  { id: "no-sugar", enabled: false },
  { id: "water-only", enabled: false },
  { id: "exercise-day", enabled: false },
  { id: "no-snacks", enabled: false },
  { id: "low-screen", enabled: false },
  { id: "read", enabled: false },
];

const habitConfig = [
  {
    id: "no-sugar",
    title: "No Sugar",
    description: "Skip added sugars today",
    icon: <CakeSlice className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-sugar",
  },
  {
    id: "water-only",
    title: "Water Only",
    description: "Drink only water today",
    icon: <Droplets className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-water",
  },
  {
    id: "exercise-day",
    title: "Exercise Day",
    description: "Get moving for 30+ mins",
    icon: <Dumbbell className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-exercise",
  },
  {
    id: "no-snacks",
    title: "No Snacks",
    description: "Stick to main meals only",
    icon: <Cookie className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-snacks",
  },
  {
    id: "low-screen",
    title: "Low Screen Time",
    description: "Limit device usage",
    icon: <Smartphone className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-screen",
  },
  {
    id: "read",
    title: "Read",
    description: "Read for at least 15 mins",
    icon: <BookOpen className="w-5 h-5 text-foreground" />,
    colorClass: "bg-habit-read",
  },
];

// Conflicting habits logic
const conflictRules: Record<string, { disables: string; reason: string }> = {
  "no-sugar": {
    disables: "no-snacks",
    reason: "",
  },
};

const Index = () => {
  const [habits, setHabits] = useState<HabitState[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if it's from today
        if (parsed.date === new Date().toDateString()) {
          return parsed.habits;
        }
      } catch (e) {
        console.error("Failed to parse stored habits");
      }
    }
    return defaultHabits;
  });

  // Save to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: new Date().toDateString(),
        habits,
      })
    );
  }, [habits]);

  const handleToggle = (id: string, enabled: boolean) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, enabled } : h));

      // Handle conflicts - if No Sugar is enabled, check for snacks
      // Note: For this demo, No Sugar doesn't actually disable another habit
      // but we can show the conflict warning on "No Snacks" when "No Sugar" is on

      return updated;
    });
  };

  const getHabitState = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    return habit?.enabled || false;
  };

  // Check if a habit should show a conflict message
  const getConflictInfo = (id: string) => {
    // If "No Sugar" is on, show a helpful message on "No Snacks"
    if (id === "no-snacks" && getHabitState("no-sugar")) {
      return {
        message: "Great combo with No Sugar! 💪",
      };
    }
    return null;
  };

  const activeCount = habits.filter((h) => h.enabled).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Instant Habit Reset
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1.5 rounded-full">
                {activeCount}/6
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Progress indicator */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((activeCount / 6) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(activeCount / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Habit Cards Grid */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Toggle Your Habits
          </h2>
          <div className="grid gap-3">
            {habitConfig.map((config, index) => {
              const conflictInfo = getConflictInfo(config.id);
              return (
                <HabitCard
                  key={config.id}
                  id={config.id}
                  title={config.title}
                  description={config.description}
                  icon={config.icon}
                  colorClass={config.colorClass}
                  isEnabled={getHabitState(config.id)}
                  onToggle={handleToggle}
                  delay={index * 50}
                />
              );
            })}
          </div>
        </section>

        {/* Reminder Panel */}
        <section>
          <ReminderPanel habits={habits} />
        </section>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Your habits reset daily at midnight
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
