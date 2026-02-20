import { CheckSquare, Calendar } from "lucide-react";
import type { ActiveTab } from "@presentation/stores/uiStore";

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs = [
  { id: "today" as const, label: "오늘", icon: CheckSquare },
  { id: "calendar" as const, label: "달력", icon: Calendar },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle z-50">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? "text-accent-primary font-semibold" : "text-txt-tertiary"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
