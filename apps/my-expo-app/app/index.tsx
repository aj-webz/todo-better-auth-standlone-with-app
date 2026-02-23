import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTodoQuery } from "@/hooks/api-hooks";
import "global.css";

export default function Home() {


  const { data: todos = [] } = useTodoQuery();

  const inProgress = todos.filter((t) => t.status === "in-progress").length;
  const completed  = todos.filter((t) => t.status === "completed").length;
  const cancelled  = todos.filter((t) => t.status === "cancelled").length;

  const fadeIn   = useSharedValue(0);
  const slideUp  = useSharedValue(40);
  const card1    = useSharedValue(0);
  const card2    = useSharedValue(0);
  const card3    = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    fadeIn.value  = withTiming(1, { duration: 700, easing: ease });
    slideUp.value = withTiming(0, { duration: 700, easing: ease });

    card1.value = withDelay(300, withTiming(1, { duration: 500, easing: ease }));
    card2.value = withDelay(450, withTiming(1, { duration: 500, easing: ease }));
    card3.value = withDelay(600, withTiming(1, { duration: 500, easing: ease }));

    btnScale.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 800 }),
          withTiming(1,    { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const heroStyle  = useAnimatedStyle(() => ({ opacity: fadeIn.value,  transform: [{ translateY: slideUp.value }] }));
  const card1Style = useAnimatedStyle(() => ({ opacity: card1.value,   transform: [{ translateY: (1 - card1.value) * 20 }] }));
  const card2Style = useAnimatedStyle(() => ({ opacity: card2.value,   transform: [{ translateY: (1 - card2.value) * 20 }] }));
  const card3Style = useAnimatedStyle(() => ({ opacity: card3.value,   transform: [{ translateY: (1 - card3.value) * 20 }] }));
  const btnStyle   = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  return (
    <View className="flex-1 bg-[#0F0F0F]">
      <StatusBar barStyle="light-content" />

      <View className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#9333EA]" style={{ opacity: 0.25 }} />
      <View className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-[#6D28D9]" style={{ opacity: 0.2 }} />

      <View className="flex-1 px-6 pt-24 pb-12">

        <Animated.View style={heroStyle} className="mb-12">
          <Text className="text-[13px] font-bold text-[#A855F7] tracking-[4px] uppercase mb-4">
            ✦ Schedule. Execute. Win.
          </Text>
          <Text className="text-[48px] font-extrabold text-white leading-tight tracking-tight">
            Your Time.{"\n"}
            <Text className="text-[#A855F7]">Your Task.</Text>
          </Text>
          <Text className="text-[#9CA3AF] text-[15px] mt-5 leading-relaxed">
            Stop juggling. Start doing. One place for everything that matters today.
          </Text>
        </Animated.View>

        <Animated.View style={card1Style} className="bg-[#29004a] border border-[#333] rounded-2xl px-5 py-4 mb-3 flex-row items-center">
          <View className="w-5 h-5 rounded-full border-2 border-[#60A5FA] mr-4" />
          <View className="flex-1">
            <Text className="text-white font-semibold text-sm">In Progress</Text>
            <Text className="text-[#9CA3AF] text-xs mt-0.5">Tasks currently active</Text>
          </View>
          <View className="bg-[#0D1F33] rounded-full px-3 py-0.5">
            <Text className="text-[#60A5FA] text-[12px] font-bold">{inProgress}</Text>
          </View>
        </Animated.View>
    
        <Animated.View style={card2Style} className="bg-[#36004b] border border-[#333] rounded-2xl px-5 py-4 mb-3 flex-row items-center">
          <View className="w-5 h-5 rounded-full border-2 border-[#34D399] mr-4 items-center justify-center">
            <View className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-sm">Completed</Text>
            <Text className="text-[#9CA3AF] text-xs mt-0.5">Tasks finished</Text>
          </View>
          <View className="bg-[#052e16] rounded-full px-3 py-0.5">
            <Text className="text-[#34D399] text-[12px] font-bold">{completed}</Text>
          </View>
        </Animated.View>

        
        <Animated.View style={card3Style} className="bg-[#280033] border border-[#333] rounded-2xl px-5 py-4 mb-3 flex-row items-center">
          <View className="w-5 h-5 rounded-full border-2 border-[#F87171] mr-4" />
          <View className="flex-1">
            <Text className="text-white font-semibold text-sm">Cancelled</Text>
            <Text className="text-[#9CA3AF] text-xs mt-0.5">Tasks dropped</Text>
          </View>
          <View className="bg-[#1A0505] rounded-full px-3 py-0.5">
            <Text className="text-[#f87178] text-[12px] font-bold">{cancelled}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[btnStyle, { marginTop: "auto" }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/private")}
            className="bg-[#9333EA] py-5 rounded-2xl flex-row items-center justify-center mb-4"
          >
            <Text className="text-white text-base font-extrabold tracking-wide">
              Schedule your day
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}