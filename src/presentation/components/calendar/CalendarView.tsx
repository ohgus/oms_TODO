import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DIContainer } from "@infrastructure/di/container";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import { useUIStore } from "@presentation/stores/uiStore";
import { useTodosByMonth } from "@presentation/hooks/useTodosByMonth";
import { TodoList } from "@presentation/components/todo/TodoList";
import { Button } from "@presentation/components/ui/button";
import {
  generateCalendarDays,
  toDateString,
  getWeekRange,
  type CalendarDay,
} from "@shared/utils/calendar";
import { formatKoreanDate, formatKoreanMonth } from "@shared/utils/date";

const WEEKDAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

function getDayCellStyle(day: CalendarDay, isSelected: boolean): string {
  if (day.isToday) return "bg-accent-primary text-white font-bold rounded-lg";
  if (isSelected) return "bg-accent-light text-accent-primary font-semibold rounded-lg";
  if (day.isCurrentMonth) return "text-txt-primary";
  return "text-txt-tertiary";
}

interface CalendarViewProps {
  container: DIContainer;
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function CalendarView({
  container,
  categories,
  onToggleComplete,
  onDelete,
  onEdit,
}: CalendarViewProps) {
  const calendarMonth = useUIStore((s) => s.calendarMonth);
  const selectedCalendarDate = useUIStore((s) => s.selectedCalendarDate);
  const navigateCalendarMonth = useUIStore((s) => s.navigateCalendarMonth);
  const setSelectedCalendarDate = useUIStore((s) => s.setSelectedCalendarDate);

  const { todos } = useTodosByMonth(container.todoRepository, calendarMonth);

  const todoDateSet = useMemo(() => {
    const set = new Set<string>();
    for (const todo of todos) {
      if (todo.dueDate) {
        set.add(toDateString(todo.dueDate));
      }
    }
    return set;
  }, [todos]);

  const calendarDays = useMemo(
    () =>
      generateCalendarDays(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth(),
        todoDateSet
      ),
    [calendarMonth, todoDateSet]
  );

  const selectedDateTodos = useMemo(() => {
    if (!selectedCalendarDate) return [];
    const dateStr = toDateString(selectedCalendarDate);
    return todos.filter((t) => t.dueDate && toDateString(t.dueDate) === dateStr);
  }, [selectedCalendarDate, todos]);

  const thisWeekTodos = useMemo(() => {
    const today = new Date();
    const { from, to } = getWeekRange(today);
    return todos.filter((t) => {
      if (!t.dueDate) return false;
      return t.dueDate >= from && t.dueDate <= to;
    });
  }, [todos]);

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateCalendarMonth("prev")}
          aria-label="이전 달"
          className="min-h-11 min-w-11"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-txt-primary">
          {formatKoreanMonth(calendarMonth)}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateCalendarMonth("next")}
          aria-label="다음 달"
          className="min-h-11 min-w-11"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center">
        {WEEKDAY_HEADERS.map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-txt-tertiary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.flat().map((day) => {
          const dateStr = toDateString(day.date);
          const isSelected =
            selectedCalendarDate && toDateString(selectedCalendarDate) === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => setSelectedCalendarDate(day.date)}
              aria-label={formatKoreanDate(day.date)}
              className={`relative flex flex-col items-center justify-center py-2 text-sm transition-colors ${getDayCellStyle(day, !!isSelected)}`}
            >
              {day.date.getDate()}
              {day.hasTodos && (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    day.isToday ? "bg-white" : "bg-accent-primary"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Section */}
      {selectedCalendarDate && (
        <section aria-label="선택 날짜 TODO">
          <h3 className="text-base font-semibold text-txt-primary mb-3">
            {formatKoreanDate(selectedCalendarDate)}
          </h3>
          <TodoList
            todos={selectedDateTodos}
            categories={categories}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            emptyMessage="이 날짜에 등록된 TODO가 없습니다"
          />
        </section>
      )}

      {/* This Week Section */}
      <section aria-label="이번 주 TODO">
        <h3 className="text-base font-semibold text-txt-primary mb-3">이번 주 TODO</h3>
        <TodoList
          todos={thisWeekTodos}
          categories={categories}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          emptyMessage="이번 주 등록된 TODO가 없습니다"
        />
      </section>
    </div>
  );
}
