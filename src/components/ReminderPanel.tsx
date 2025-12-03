import { Lightbulb, Droplets, Dumbbell, Cookie, Smartphone, BookOpen, CakeSlice } from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  enabled: boolean;
}

interface ReminderPanelProps {
  habits: Habit[];
}

const reminderData: Record<string, { icon: React.ReactNode; tips: string[] }> = {
  "no-sugar": {
    icon: <CakeSlice className="w-4 h-4" />,
    tips: [
      "Try fruit when craving sweets",
      "Check labels for hidden sugars",
      "Stay hydrated to reduce cravings",
    ],
  },
  "water-only": {
    icon: <Droplets className="w-4 h-4" />,
    tips: [
      "Aim for 8 glasses today",
      "Add lemon for variety",
      "Set hourly water reminders",
    ],
  },
  "exercise-day": {
    icon: <Dumbbell className="w-4 h-4" />,
    tips: [
      "Even 20 mins counts!",
      "Take the stairs today",
      "Stretch before and after",
    ],
  },
  "no-snacks": {
    icon: <Cookie className="w-4 h-4" />,
    tips: [
      "Eat filling meals",
      "Drink water when hungry",
      "Keep busy between meals",
    ],
  },
  "low-screen": {
    icon: <Smartphone className="w-4 h-4" />,
    tips: [
      "Set app time limits",
      "No phones at meals",
      "Try a screen-free hour",
    ],
  },
  "read": {
    icon: <BookOpen className="w-4 h-4" />,
    tips: [
      "Read for 15 mins minimum",
      "Try audiobooks while commuting",
      "Keep a book by your bed",
    ],
  },
};

const ReminderPanel = ({ habits }: ReminderPanelProps) => {
  const activeHabits = habits.filter((h) => h.enabled);

  if (activeHabits.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-muted rounded-xl">
            <Lightbulb className="w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="font-bold text-lg text-foreground">Today's Reminders</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Toggle some habits above to see personalized tips!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-bold text-lg text-foreground">Today's Reminders</h2>
        <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
          {activeHabits.length} active
        </span>
      </div>

      <div className="space-y-3">
        {activeHabits.map((habit, index) => {
          const data = reminderData[habit.id];
          if (!data) return null;

          const randomTip = data.tips[Math.floor(Math.random() * data.tips.length)];

          return (
            <div
              key={habit.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-muted/50 animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {data.icon}
              </div>
              <p className="text-sm text-foreground flex-1">{randomTip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReminderPanel;
