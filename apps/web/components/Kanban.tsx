"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { Todo, TodoStatus } from "@repo/shared";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { formatToIST } from "@/lib/date-utils";
import {
  useDeleteTodo,
  useTodoQuery,
  useUpdateTodoStatus,
} from "../hooks/queryhook";

const isTodoStatus = (value: string): value is TodoStatus =>
  ["backlog", "todo", "in-progress", "completed", "cancelled"].includes(value);

const statusColumns: { id: TodoStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const statusColor: Record<TodoStatus, string> = {
  backlog: "bg-slate-500",
  todo: "bg-purple-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const getCardBg = (todo: Todo, now: number) => {
  if (!todo.endAt) {
    return "bg-white";
  }
  if (todo.status !== "in-progress") {
    return "bg-white";
  }

  const start = new Date(todo.createdAt).getTime();
  const end = new Date(todo.endAt).getTime();
  const total = end - start;
  const remaining = end - now;
  const remainingRatio = remaining / total;

  if (remainingRatio <= 0.25) {
    return "bg-red-50";
  }
  if (remainingRatio <= 0.5) {
    return "bg-yellow-50";
  }
  return "bg-gray-50";
};

const getProgress = (todo: Todo, now: number) => {
  if (!todo.endAt || todo.status !== "in-progress") {
    return null;
  }

  const start = new Date(todo.createdAt).getTime();
  const end = new Date(todo.endAt).getTime();
  const total = end - start;
  const elapsed = now - start;
  const remaining = end - now;

  let color = "bg-gray-200";
  if (remaining <= 2 * 60 * 60 * 1000) {
    color = "bg-red-100";
  } else if (elapsed >= total / 2) {
    color = "bg-yellow-200";
  }

  const value = Math.min(100, (elapsed / total) * 100);
  return { value, color };
};

const TimeTicker = ({
  endAt,
  now,
  progress,
}: {
  endAt: string;
  now: number;
  progress: number;
}) => {
  const remaining = new Date(endAt).getTime() - now;
  if (remaining <= 0) {
    return (
      <div className="mt-1 flex items-center justify-between">
        <span className="font-bold text-[10px] text-gray-500">Time Left</span>
        <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-[10px] text-red-600">
          Expired!
        </span>
      </div>
    );
  }
  const h = Math.floor(remaining / (1000 * 60 * 60));
  const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((remaining % (1000 * 60)) / 1000);
  const timeString = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const colorClass =
    progress >= 75
      ? "bg-red-100 text-red-600"
      : progress >= 50
        ? "bg-yellow-100 text-yellow-600"
        : "bg-green-100 text-green-600";
  return (
    <div className="mt-1 flex items-center justify-between">
      <span className="font-semibold text-[8px] text-gray-500">Time Left</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-bold text-[9px]",
          colorClass
        )}
      >
        {timeString}
      </span>
    </div>
  );
};

export const KanbanBoard = () => {
  const { data, isLoading, isError } = useTodoQuery();
  const todos: Todo[] = Array.isArray(data) ? data : [];

  const updateTodoStatus = useUpdateTodoStatus();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    todos.forEach((todo) => {
      if (
        todo.status === "in-progress" &&
        todo.endAt &&
        new Date(todo.endAt).getTime() <= now
      ) {
        updateTodoStatus.mutate({
          params: { path: { id: todo.id } },
          body: { status: "backlog" },
        });
      }
    });
  }, [now]);
  const grouped = useMemo(() => {
    const map: Record<TodoStatus, Todo[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      completed: [],
      cancelled: [],
    };
    todos.forEach((t) => map[t.status].push(t));
    return map;
  }, [todos]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    const fromStatus = source.droppableId;
    const toStatus = destination.droppableId;
    if (toStatus === fromStatus) {
      return;
    }
    if (!isTodoStatus(toStatus)) {
      return;
    }
    if (toStatus === "backlog") {
      return;
    }

    updateTodoStatus.mutate({
      params: { path: { id: draggableId.replace("todo-", "") } },
      body: { status: toStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Loading todos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-red-500">
        Failed to load todos. Please refresh.
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statusColumns.map((col) => (
          <Card className="flex flex-col" key={col.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-semibold text-[12px]">
                {col.label}
                <span className="text-[11px] text-muted-foreground">
                  {grouped[col.id].length}
                </span>
              </CardTitle>
            </CardHeader>

            <Droppable droppableId={col.id}>
              {(p) => (
                <CardContent
                  ref={p.innerRef}
                  {...p.droppableProps}
                  className="min-h-[160px] space-y-4"
                >
                  {grouped[col.id].map((todo, index) => (
                    <TodoCard
                      index={index}
                      key={todo.id}
                      now={now}
                      todo={todo}
                    />
                  ))}
                  {p.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
};

const TodoCard = ({
  todo,
  index,
  now,
}: {
  todo: Todo;
  index: number;
  now: number;
}) => {
  const progress = getProgress(todo, now);
  const deleteTodoMutation = useDeleteTodo();

  const handleDelete = () => {
    deleteTodoMutation.mutate({
      params: { path: { id: todo.id } },
    });
  };

  return (
    <Draggable draggableId={`todo-${todo.id}`} index={index}>
      {(p) => (
        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
          <Card
            className={cn(
              "flex h-[280px] flex-col justify-between rounded-xl border border-gray-100 shadow-md", // ← h-260 to h-280
              getCardBg(todo, now)
            )}
          >
            <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
              {" "}
              {/* ← p-5 to p-6, gap-3 to gap-4 */}
              {/* Title + Badge + Delete */}
              <div className="flex flex-col gap-2.5">
                {" "}
                {/* ← gap-2 to gap-2.5 */}
                <div className="flex items-start justify-between">
                  <h3
                    className="font-bold text-[13px] text-gray-800 leading-snug"
                    title={todo.title}
                  >
                    {todo.title.length > 14
                      ? `${todo.title.slice(0, 14)}…`
                      : todo.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={cn(
                        statusColor[todo.status],
                        "h-4 rounded-full px-1.5 text-[9px]"
                      )}
                    >
                      {todo.status}
                    </Badge>
                    <Button
                      className="h-5 w-5 rounded-full bg-red-500 p-0 text-[8px] text-white hover:bg-red-600"
                      disabled={deleteTodoMutation.isPending}
                      onClick={handleDelete}
                    >
                      {deleteTodoMutation.isPending ? "..." : "✕"}
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-2 text-[11px] text-gray-400 leading-relaxed">
                  {todo.description}
                </p>
              </div>
              <div className="border-gray-100 border-t" />
              <div className="flex items-center justify-between">
                <span className="flex flex-col gap-1">
                  {" "}
                  {/* ← gap-0.5 to gap-1 */}
                  <span className="font-semibold text-[9px] text-gray-400 uppercase tracking-wide">
                    Start
                  </span>
                  <span className="font-semibold text-[12px] text-gray-700">
                    {formatToIST(new Date(todo.createdAt), "dd MMM HH:mm:ss")}
                  </span>
                </span>
                {todo.endAt && (
                  <span className="flex flex-col items-end gap-1">
                    {" "}
                    {/* ← gap-0.5 to gap-1 */}
                    <span className="font-semibold text-[9px] text-gray-400 uppercase tracking-wide">
                      End
                    </span>
                    <span className="font-semibold text-[12px] text-gray-700">
                      {formatToIST(new Date(todo.endAt), "dd MMM HH:mm:ss")}
                    </span>
                  </span>
                )}
              </div>
              {todo.status === "completed" && todo.completedAt && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-1.5">
                  {" "}
                  {/* ← px-2 to px-3, py-1 to py-1.5 */}
                  <span className="font-semibold text-[9px] text-green-500 uppercase tracking-wide">
                    ✓ Completed
                  </span>
                  <span className="font-semibold text-[12px] text-green-600">
                    {formatToIST(new Date(todo.completedAt), "dd MMM HH:mm:ss")}
                  </span>
                </div>
              )}
              {progress && todo.endAt && (
                <div className="flex flex-col gap-2">
                  {" "}
                  {/* ← gap-1.5 to gap-2 */}
                  <TimeTicker
                    endAt={todo.endAt}
                    now={now}
                    progress={progress.value}
                  />
                  <Progress
                    className={cn("h-1.5 rounded-full", progress.color)}
                    value={progress.value}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
