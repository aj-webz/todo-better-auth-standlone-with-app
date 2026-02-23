import { View, Text, TouchableOpacity } from "react-native";
import { useUpdateTodoStatus, useDeleteTodo } from "@/hooks/api-hooks";
import { format } from "date-fns";
import { TodoStatusEnum, TodoSchema, Todo } from "@repo/shared";
import z from "zod";

export type TodoSchema = z.infer<typeof TodoSchema>;
export type TodoStatus = z.infer<typeof TodoStatusEnum>;

const STATUS: Record<TodoStatus, { bg: string; text: string; label: string }> = {
  backlog:       { bg: "#1F2937", text: "#9CA3AF", label: "Backlog" },
  todo:          { bg: "#2E1065", text: "#C4B5FD", label: "Todo" },
  "in-progress": { bg: "#0D1F33", text: "#60A5FA", label: "In Progress" },
  completed:     { bg: "#052e16", text: "#34D399", label: "Completed" },
  cancelled:     { bg: "#1A0505", text: "#F87171", label: "Cancelled" },
};

function TimeTicker({ endAt, now }: { endAt: string; now: number }) {
  const remaining = new Date(endAt).getTime() - now;

  if (remaining <= 0) {
    return (
      <View className="flex-row items-center justify-between mt-3">
        <Text className="text-xs text-[#9CA3AF]">Time Left</Text>
        <View className="bg-red-900 rounded-full px-3 py-1">
          <Text className="text-xs font-bold text-[#F87171]">Expired!</Text>
        </View>
      </View>
    );
  }

  const total = new Date(endAt).getTime() - (now - remaining);
  const progress = (1 - remaining / total) * 100;

  const h = Math.floor(remaining / (1000 * 60 * 60));
  const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((remaining % (1000 * 60)) / 1000);
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const colorBg   = progress >= 75 ? "#450a0a" : progress >= 50 ? "#422006" : "#052e16";
  const colorText = progress >= 75 ? "#F87171" : progress >= 50 ? "#FBBF24" : "#34D399";

  return (
    <View className="flex-row items-center justify-between mt-3">
      <Text className="text-xs text-[#9CA3AF]">Time Left</Text>
      <View style={{ backgroundColor: colorBg }} className="rounded-full px-3 py-1">
        <Text className="text-xs font-bold" style={{ color: colorText }}>{timeStr}</Text>
      </View>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
  borderColor,
  bgColor,
  textColor,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  borderColor: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flex: 1,
        backgroundColor: bgColor,
        borderWidth: 1.5,
        borderColor,
        borderRadius: 16,
        paddingVertical: 13,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: textColor, fontSize: 13, fontWeight: "700", letterSpacing: 0.4 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TodoCard({ todo, now }: { todo: Todo; now: number }) {
  const updateStatus = useUpdateTodoStatus();
  const deleteTodo = useDeleteTodo();

  const { bg, text, label } = STATUS[todo.status];
  const fmt = (d: string) => format(new Date(d), "dd MMM, HH:mm");
  const isPending = updateStatus.isPending;

  const mutate = (status: TodoStatus) =>
    updateStatus.mutate({ params: { path: { id: todo.id } }, body: { status } });

  return (
    <View
      style={{
        backgroundColor: "#1C1C1C",
        borderWidth: 1,
        borderColor: "#2A2A2A",
        borderRadius: 24,
        marginBottom: 16,
        paddingHorizontal: 20,
        paddingVertical: 22,
      }}
    >
     
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16, flex: 1, marginRight: 10 }} numberOfLines={2}>
          {todo.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: text, fontSize: 10, fontWeight: "700" }}>{label}</Text>
          </View>
          <TouchableOpacity
            onPress={() => deleteTodo.mutate({ params: { path: { id: todo.id } } })}
            disabled={deleteTodo.isPending}
            style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: "#1A0505",
              borderWidth: 1, borderColor: "#F87171",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Text style={{ color: "#F87171", fontSize: 12, fontWeight: "800" }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {todo.description ? (
        <Text style={{ color: "#6B7280", fontSize: 13, lineHeight: 20, marginBottom: 16 }} numberOfLines={2}>
          {todo.description}
        </Text>
      ) : <View style={{ marginBottom: 16 }} />}

      <View style={{ height: 1, backgroundColor: "#2A2A2A", marginBottom: 16 }} />

    
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View>
          <Text style={{ color: "#6B7280", fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Start</Text>
          <Text style={{ color: "#9CA3AF", fontSize: 12, fontWeight: "600" }}>{fmt(todo.createdAt)}</Text>
        </View>
        {todo.endAt && (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "#6B7280", fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>End</Text>
            <Text style={{ color: "#9CA3AF", fontSize: 12, fontWeight: "600" }}>{fmt(todo.endAt)}</Text>
          </View>
        )}
      </View>

   
      {todo.status === "completed" && todo.completedAt && (
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          backgroundColor: "#052e16", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
          marginBottom: 16,
        }}>
          <Text style={{ color: "#34D399", fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" }}>✓ Completed</Text>
          <Text style={{ color: "#34D399", fontSize: 12, fontWeight: "600" }}>{fmt(todo.completedAt)}</Text>
        </View>
      )}


       {/* Button */}
      {todo.status === "in-progress" && todo.endAt && (
        <View style={{ marginBottom: 16 }}>
          <TimeTicker endAt={todo.endAt} now={now} />
        </View>
      )}

      <View style={{ height: 1, backgroundColor: "#2A2A2A", marginBottom: 16 }} />


   
      {(todo.status === "todo" || todo.status === "backlog") && (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ActionButton
            label= "Start"
            onPress={() => mutate("in-progress")}
            disabled={isPending}
            bgColor="#0D1F33"
            borderColor="#60A5FA"
            textColor="#60A5FA"
          />
          <ActionButton
            label="✓  Complete"
            onPress={() => mutate("completed")}
            disabled={isPending}
            bgColor="#052e16"
            borderColor="#34D399"
            textColor="#34D399"
          />
        </View>
      )}

    
      {todo.status === "in-progress" && (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ActionButton
            label="✓  Complete"
            onPress={() => mutate("completed")}
            disabled={isPending}
            bgColor="#052e16"
            borderColor="#34D399"
            textColor="#34D399"
          />
          <ActionButton
            label="✕  Cancel"
            onPress={() => mutate("cancelled")}
            disabled={isPending}
            bgColor="#1A0505"
            borderColor="#F87171"
            textColor="#F87171"
          />
        </View>
      )}

      {(todo.status === "completed" || todo.status === "cancelled") && (
        <Text style={{ color: "#fff4ff", fontSize: 12, textAlign: "center", letterSpacing: 0.3 }}>
          {todo.status === "cancelled" ? "Task cancelled" : "Task done"}
        </Text>
      )}
    </View>
  );
}