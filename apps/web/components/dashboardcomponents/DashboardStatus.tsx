"use client";

import { isToday } from "date-fns";
import { useTodoQuery } from "@/hooks/queryhook";
import StatCard from "./StatCard";

export function DashboardStats() {
  const { data: todos = [] } = useTodoQuery();

  const today = todos.filter((t) => isToday(t.createdAt)).length;

  const pending = todos.filter((t) => t.status === "in-progress").length;

  const completed = todos.filter((t) => t.status === "completed").length;

  const backlogCount = todos.filter((t) => t.status === "backlog").length;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
      <StatCard
        label="Today"
        total={todos.length}
        value={today}
        variant="today"
      />
      <StatCard
        label="Pending"
        total={todos.length}
        value={pending}
        variant="pending"
      />
      <StatCard
        label="Completed"
        total={todos.length}
        value={completed}
        variant="completed"
      />
      <StatCard
        label="Backlog"
        total={todos.length}
        value={backlogCount}
        variant="backlog"
      />
    </div>
  );
}
