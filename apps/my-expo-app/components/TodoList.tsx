import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useTodoQuery } from "@/hooks/api-hooks";
import TodoCard from "./TodoCard";
import { TouchableOpacity } from "react-native";
import type { TodoStatus } from "./TodoCard";

const FILTERS : { label:string, value:TodoStatus | "all"}[] = [
  { label: "All",         value: "all" },
  { label: "Todo",        value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
  { label: "Backlog",     value: "backlog" },
  { label: "Cancelled",   value: "cancelled" },
]

const FILTER_COLOR : Record<string, string> = {
  
  all:           "#A855F7",
  todo:          "#C4B5FD",
  "in-progress": "#60A5FA",
  completed:     "#34D399",
  backlog:       "#9CA3AF",
  cancelled:     "#F87171",
}


export default function TodoList() {
  const { data: todos = [], isLoading, isError } = useTodoQuery();
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "all" ? todos : todos.filter((t) => t.status === filter);

  if (isLoading) {
    return (
      <View className="items-center py-10">
        <ActivityIndicator color="#A855F7" />
        <Text className="text-[#6B7280] text-sm mt-3">Loading todos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center py-10">
        <Text className="text-[#F87171] text-sm">Failed to load. Please refresh.</Text>
      </View>
    );
  }

  return (
    <View className="mt-6">

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-extrabold">My Tasks</Text>
        <Text className="text-[#6B7280] text-xs">{filtered.length} tasks</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
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
              <Text style={{ color: isActive ? "#fff" : "#6B7280", fontSize: 12, fontWeight: "600" }}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filtered.length === 0 && (
        <View className="items-center py-16">
          <Text className="text-4xl mb-3">🎉</Text>
          <Text className="text-white font-bold text-base">All clear!</Text>
          <Text className="text-[#6B7280] text-sm mt-1">No tasks here.</Text>
        </View>
      )}

    
      {filtered.map((todo) => (
        <TodoCard key={todo.id} todo={todo} now={now} />
      ))}

    </View>
  );
}