"use client";

import type { Todo } from "@repo/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@workspace/ui/components/chart";
import { isToday } from "date-fns";
import { useTodoQuery } from "@/hooks/query-hook";

function dataVariation(todos: Todo[]) {
  return [
    {
      label: "Today",
      value: todos.filter((t) => isToday(new Date(t.createdAt))).length,
    },
    {
      label: "Pending",
      value: todos.filter((t) => t.status === "in-progress").length,
    },
    {
      label: "Completed",
      value: todos.filter((t) => t.status === "completed").length,
    },
  ];
}

export function TodoStatusChart() {
  const { data: todos = [] } = useTodoQuery();
  const data = dataVariation(todos);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
      </CardHeader>

      <CardContent className="h-64">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <XAxis
              axisLine={false}
              dataKey="label"
              fontSize={12}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              fontSize={12}
              tickLine={false}
            />
            <Tooltip />

            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
