import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTodoQuery } from "@/hooks/api-hooks";
import type { TodoStatus } from "./TodoCard";
import TodoCard from "./TodoCard";

const FILTERS: { label: string; value: TodoStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Backlog", value: "backlog" },
  { label: "Cancelled", value: "cancelled" },
];

const FILTER_COLOR: Record<string, string> = {
  all: "#A855F7",
  todo: "#C4B5FD",
  "in-progress": "#60A5FA",
  completed: "#34D399",
  backlog: "#9CA3AF",
  cancelled: "#F87171",
};

export default function TodoList() {
  const { data: todos = [], isLoading, isError } = useTodoQuery();
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    filter === "all" ? todos : todos.filter((t) => t.status === filter);

  if (isLoading) {
    return (
      <View className="items-center py-10">
        <ActivityIndicator color="#A855F7" />
        <Text className="mt-3 text-[#6B7280] text-sm">Loading todos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center py-10">
        <Text className="text-[#F87171] text-sm">
          Failed to load. Please refresh.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-extrabold text-lg text-white">My Tasks</Text>
        <Text className="text-[#6B7280] text-xs">{filtered.length} tasks</Text>
      </View>

      <ScrollView
        className="mb-4"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          const color = FILTER_COLOR[f.value];
          return (
            <TouchableOpacity
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={{
                backgroundColor: isActive ? color : "#1C1C1C",
                borderWidth: 1,
                borderColor: isActive ? color : "#2A2A2A",
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 6,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: isActive ? "#fff" : "#6B7280",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filtered.length === 0 && (
        <View className="items-center py-16">
          <Text className="mb-3 text-4xl">🎉</Text>
          <Text className="font-bold text-base text-white">All clear!</Text>
          <Text className="mt-1 text-[#6B7280] text-sm">No tasks here.</Text>
        </View>
      )}

      {filtered.map((todo) => (
        <TodoCard key={todo.id} now={now} todo={todo} />
      ))}
    </View>
  );
}
