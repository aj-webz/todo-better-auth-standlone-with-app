import { ScrollView, View } from "react-native";
import StatCard from "@/components/StatCard";
import { useTodoQuery } from "@/hooks/api-hooks";

export default function CardLayout() {
  const { data: todos = [] } = useTodoQuery();

  const total = todos.length;
  const today = todos.filter((t) => t.status === "in-progress").length;
  const pending = todos.filter((t) => t.status === "todo").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const backlog = todos.filter((t) => t.status === "backlog").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  return (
    <View>
      <View style={{ height: 200 }}>
        <ScrollView
          className="w-full"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <StatCard label="Today" total={total} value={today} variant="today" />
          <StatCard
            label="Pending"
            total={total}
            value={pending}
            variant="pending"
          />
          <StatCard
            label="Completed"
            total={total}
            value={completed}
            variant="completed"
          />
          <StatCard
            label="Backlog"
            total={total}
            value={backlog}
            variant="backlog"
          />
          <StatCard
            label="Cancelled"
            total={total}
            value={cancelled}
            variant="cancelled"
          />
        </ScrollView>
      </View>
    </View>
  );
}
