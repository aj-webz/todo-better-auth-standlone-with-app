"use client";
import { isToday } from "date-fns";
import { useTodoQuery } from "@/hooks/queryhook";
import StatCard from "./StatCard";
export function DashboardStats() {
  const { data: todos = [] } = useTodoQuery();

  const todayCount = todos.filter((t) => isToday(new Date(t.createdAt))).length;

  const pendingCount = todos.filter((t) => t.status === "in-progress").length;

  const completedCount = todos.filter((t) => t.status === "completed").length;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <StatCard
        label="Today"
        total={todos.length}
        value={todayCount}
        variant="today"
      />
      <StatCard
        label="Pending"
        total={todos.length}
        value={pendingCount}
        variant="pending"
      />
      <StatCard
        label="Completed"
        total={todos.length}
        value={completedCount}
        variant="completed"
      />
    </div>
  );
}
