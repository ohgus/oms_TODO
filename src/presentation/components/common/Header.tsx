import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@presentation/components/ui/button";

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <CheckSquare className="h-8 w-8 text-accent-primary" />
        <h1 className="text-2xl font-bold text-txt-primary">TODO</h1>
      </div>
      <Button
        onClick={onAddClick}
        size="icon"
        className="min-h-11 min-w-11 bg-accent-primary text-white hover:bg-accent-primary/90"
        aria-label="Add todo"
        data-testid="add-todo-button"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </header>
  );
}
