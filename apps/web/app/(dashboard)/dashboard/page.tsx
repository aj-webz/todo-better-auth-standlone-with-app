"use client";

import { DashboardStats } from "@/components/dashboardcomponents/CardStatus";
import StatCard from "@/components/dashboardcomponents/StatCard";
import { TodoStatusChart } from "@/components/dashboardcomponents/TodoCharts";
import { TodoProgress } from "@/components/dashboardcomponents/TodoProgress";
import Sidebar from "@/components/sidebar/Sidebar";
import { useTodoQuery } from "@/hooks/queryhook";

export default function DashboardPage() {
  const { data: todos = [] } = useTodoQuery();

  const backlogCount = todos.filter((t) => t.status === "backlog").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside>
        <Sidebar />
      </aside>

      <main className="flex-1 transition-all duration-500 ease-in-out">
        <div className="space-y-8 p-8">
          <div className="flex flex-col space-y-4">
            <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your work</p>
          </div>

          <DashboardStats />

          <div className="grid max-w-9xl grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              label="Backlog"
              total={todos.length}
              value={backlogCount}
              variant="backlog"
            />
            <StatCard
              label="Cancelled"
              total={todos.length}
              value={cancelled}
              variant="cancelled"
            />
            <TodoProgress />
          </div>

          <TodoStatusChart />
        </div>
      </main>
    </div>
  );
}
