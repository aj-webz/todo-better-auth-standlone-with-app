import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import CardLayout from "@/components/DashStatus";
import { useTodoQuery } from "@/hooks/api-hooks";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const { data: todos = [] } = useTodoQuery();

  const total = todos.length;
  const today = todos.filter((t) => t.status === "in-progress").length;
  const pending = todos.filter((t) => t.status === "todo").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const backlog = todos.filter((t) => t.status === "backlog").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FAF8FF" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 28 }}>
          <Text
            className="font-extrabold tracking-tight"
            style={{ fontSize: 28, color: "#3B0764", letterSpacing: 0.3 }}
          >
            Dashboard
          </Text>
          <Text className="text-sm" style={{ color: "#A78BFA", marginTop: 4 }}>
            Your productivity at a glance
          </Text>
        </View>

        <View
          className="rounded-3xl"
          style={{
            backgroundColor: "#301934",
            padding: 24,
            marginBottom: 28,
            shadowColor: "#7C3AED",
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          <Text
            className="font-semibold"
            style={{
              color: "#DDD6FE",
              fontSize: 13,
              marginBottom: 6,
              letterSpacing: 0.5,
            }}
          >
            OVERALL COMPLETION
          </Text>
          <Text
            className="font-extrabold text-white"
            style={{ fontSize: 48, marginBottom: 16, lineHeight: 52 }}
          >
            {completionRate}%
          </Text>
          <View
            className="rounded-full"
            style={{ height: 8, backgroundColor: "#5B21B6" }}
          >
            <View
              className="rounded-full"
              style={{
                height: 8,
                backgroundColor: "#E9D5FF",
                width: `${completionRate}%`,
              }}
            />
          </View>
          <Text style={{ color: "#C4B5FD", fontSize: 12, marginTop: 10 }}>
            {completed} of {total} tasks completed
          </Text>
        </View>

        <View className="flex-row" style={{ gap: 12, marginBottom: 28 }}>
          <View
            className="flex-1 items-center"
            style={{
              backgroundColor: "#F3E8FF",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#E9D5FF",
            }}
          >
            <Text
              className="font-extrabold"
              style={{ fontSize: 28, color: "#7C3AED" }}
            >
              {total}
            </Text>
            <Text
              className="font-semibold"
              style={{ fontSize: 11, color: "#A78BFA", marginTop: 4 }}
            >
              TOTAL
            </Text>
          </View>
          <View
            className="flex-1 items-center"
            style={{
              backgroundColor: "#EEF2FF",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#C7D2FE",
            }}
          >
            <Text
              className="font-extrabold"
              style={{ fontSize: 28, color: "#4338CA" }}
            >
              {today}
            </Text>
            <Text
              className="font-semibold"
              style={{ fontSize: 11, color: "#818CF8", marginTop: 4 }}
            >
              ACTIVE
            </Text>
          </View>
          <View
            className="flex-1 items-center"
            style={{
              backgroundColor: "#F0FDF4",
              borderRadius: 18,
              padding: 18,
              borderWidth: 1,
              borderColor: "#BBF7D0",
            }}
          >
            <Text
              className="font-extrabold"
              style={{ fontSize: 28, color: "#16A34A" }}
            >
              {completed}
            </Text>
            <Text
              className="font-semibold"
              style={{ fontSize: 11, color: "#4ADE80", marginTop: 4 }}
            >
              DONE
            </Text>
          </View>
        </View>

        <Text
          className="font-bold"
          style={{ fontSize: 16, color: "#3B0764", marginBottom: 14 }}
        >
          Overview
        </Text>
        <View style={{ height: 200, marginBottom: 28 }}>
          <CardLayout />
        </View>

        <Text
          className="font-bold"
          style={{ fontSize: 16, color: "#3B0764", marginBottom: 14 }}
        >
          Tasks by Status
        </Text>
        <View
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 24,
            paddingTop: 16,
            borderWidth: 1,
            borderColor: "#EDE9FE",
            shadowColor: "#7C3AED",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <BarChart
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
              labelColor: () => "#A78BFA",
              barPercentage: 0.6,
              propsForBackgroundLines: { stroke: "#F3E8FF" },
            }}
            data={{
              labels: ["Active", "Todo", "Done", "Backlog", "Cancel"],
              datasets: [
                { data: [today, pending, completed, backlog, cancelled] },
              ],
            }}
            fromZero
            height={240}
            showValuesOnTopOfBars
            style={{ borderRadius: 16 }}
            width={screenWidth - 40}
            withInnerLines
            yAxisInterval={1}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
