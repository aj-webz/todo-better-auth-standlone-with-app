import { router } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTodoQuery } from "@/hooks/api-hooks";
import "global.css";

export default function Home() {
  const { data: todos = [] } = useTodoQuery();

  const inProgress = todos.filter((t) => t.status === "in-progress").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(40);
  const card1 = useSharedValue(0);
  const card2 = useSharedValue(0);
  const card3 = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    fadeIn.value = withTiming(1, { duration: 700, easing: ease });
    slideUp.value = withTiming(0, { duration: 700, easing: ease });

    card1.value = withDelay(
      300,
      withTiming(1, { duration: 500, easing: ease })
    );
    card2.value = withDelay(
      450,
      withTiming(1, { duration: 500, easing: ease })
    );
    card3.value = withDelay(
      600,
      withTiming(1, { duration: 500, easing: ease })
    );

    btnScale.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));
  const card1Style = useAnimatedStyle(() => ({
    opacity: card1.value,
    transform: [{ translateY: (1 - card1.value) * 20 }],
  }));
  const card2Style = useAnimatedStyle(() => ({
    opacity: card2.value,
    transform: [{ translateY: (1 - card2.value) * 20 }],
  }));
  const card3Style = useAnimatedStyle(() => ({
    opacity: card3.value,
    transform: [{ translateY: (1 - card3.value) * 20 }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <StatusBar barStyle="light-content" />

      <View
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#9333EA]"
        style={{ opacity: 0.25 }}
      />
      <View
        className="absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-[#6D28D9]"
        style={{ opacity: 0.2 }}
      />

      <View className="flex-1 px-6 pt-24 pb-12">
        <Animated.View className="mb-12" style={heroStyle}>
          <Text className="mb-4 font-bold text-[#A855F7] text-[13px] uppercase tracking-[4px]">
            ✦ Schedule. Execute. Win.
          </Text>
          <Text className="font-extrabold text-[48px] text-white leading-tight tracking-tight">
            Your Time.{"\n"}
            <Text className="text-[#A855F7]">Your Task.</Text>
          </Text>
          <Text className="mt-5 text-[#9CA3AF] text-[15px] leading-relaxed">
            Stop juggling. Start doing. One place for everything that matters
            today.
          </Text>
        </Animated.View>

        <Animated.View
          className="mb-3 flex-row items-center rounded-2xl border border-[#333] bg-[#29004a] px-5 py-4"
          style={card1Style}
        >
          <View className="mr-4 h-5 w-5 rounded-full border-2 border-[#60A5FA]" />
          <View className="flex-1">
            <Text className="font-semibold text-sm text-white">
              In Progress
            </Text>
            <Text className="mt-0.5 text-[#9CA3AF] text-xs">
              Tasks currently active
            </Text>
          </View>
          <View className="rounded-full bg-[#0D1F33] px-3 py-0.5">
            <Text className="font-bold text-[#60A5FA] text-[12px]">
              {inProgress}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          className="mb-3 flex-row items-center rounded-2xl border border-[#333] bg-[#36004b] px-5 py-4"
          style={card2Style}
        >
          <View className="mr-4 h-5 w-5 items-center justify-center rounded-full border-2 border-[#34D399]">
            <View className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-sm text-white">Completed</Text>
            <Text className="mt-0.5 text-[#9CA3AF] text-xs">
              Tasks finished
            </Text>
          </View>
          <View className="rounded-full bg-[#052e16] px-3 py-0.5">
            <Text className="font-bold text-[#34D399] text-[12px]">
              {completed}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          className="mb-3 flex-row items-center rounded-2xl border border-[#333] bg-[#280033] px-5 py-4"
          style={card3Style}
        >
          <View className="mr-4 h-5 w-5 rounded-full border-2 border-[#F87171]" />
          <View className="flex-1">
            <Text className="font-semibold text-sm text-white">Cancelled</Text>
            <Text className="mt-0.5 text-[#9CA3AF] text-xs">Tasks dropped</Text>
          </View>
          <View className="rounded-full bg-[#1A0505] px-3 py-0.5">
            <Text className="font-bold text-[#f87178] text-[12px]">
              {cancelled}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[btnStyle, { marginTop: "auto" }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            className="mb-4 flex-row items-center justify-center rounded-2xl bg-[#9333EA] py-5"
            onPress={() => router.push("/private")}
          >
            <Text className="font-extrabold text-base text-white tracking-wide">
              Schedule your day
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
