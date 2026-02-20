import { Star } from "lucide-react";
import type { Priority } from "@domain/entities/Todo";

interface PriorityStarsProps {
  level: Priority;
}

export function PriorityStars({ level }: PriorityStarsProps) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`중요도 ${level}단계`}>
      {([1, 2, 3] as const).map((i) =>
        i <= level ? (
          <Star
            key={i}
            className="h-3 w-3 fill-star-filled text-star-filled"
            data-testid="star-filled"
          />
        ) : (
          <Star
            key={i}
            className="h-3 w-3 fill-none text-star-empty"
            data-testid="star-empty"
          />
        )
      )}
    </div>
  );
}
