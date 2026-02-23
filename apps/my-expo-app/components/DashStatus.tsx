
import { View, Text, ScrollView } from "react-native";
import StatCard from "@/components/StatCard";
import { useTodoQuery } from "@/hooks/api-hooks";

export default function CardLayout() {
  const { data: todos = [] } = useTodoQuery();

  const total     = todos.length;
  const today     = todos.filter((t) => t.status === "in-progress").length;
  const pending   = todos.filter((t) => t.status === "todo").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const backlog   = todos.filter((t) => t.status === "backlog").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  return (
    <View>
      <View style={{ height: 200 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
          <StatCard label="Today"     value={today}     total={total} variant="today" />
          <StatCard label="Pending"   value={pending}   total={total} variant="pending" />
          <StatCard label="Completed" value={completed} total={total} variant="completed" />
          <StatCard label="Backlog"   value={backlog}   total={total} variant="backlog" />
          <StatCard label="Cancelled" value={cancelled} total={total} variant="cancelled" />
        </ScrollView>
      </View>
    </View>
  );
}