import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import "global.css"

export default function Home() {
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const bodyOpacity = useSharedValue(0);
  const bodyY = useSharedValue(20);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(20);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    headerOpacity.value = withTiming(1, { duration: 600, easing: ease });
    headerY.value = withTiming(0, { duration: 600, easing: ease });

    bodyOpacity.value = withDelay(200, withTiming(1, { duration: 500, easing: ease }));
    bodyY.value = withDelay(200, withTiming(0, { duration: 500, easing: ease }));

    btnOpacity.value = withDelay(400, withTiming(1, { duration: 500, easing: ease }));
    btnY.value = withDelay(400, withTiming(0, { duration: 500, easing: ease }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ translateY: bodyY.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  return (
    <View className="flex-1 bg-[#F5F3EE]">
      <StatusBar barStyle="dark-content" />

     
      <View className="absolute -top-28 -right-16 w-72 h-72 rounded-full bg-[#E8E2D5]" />

      <View className="flex-1 px-7 justify-center pb-12 pt-24">

    
        <Animated.View style={headerStyle} className="self-start border border-[#C5B99A] rounded px-3 py-1 mb-5">
          <Text className="text-[10px] font-bold text-[#9C8A6E] tracking-widest">
            SECURE ACCESS
          </Text>
        </Animated.View>

       
        <Animated.Text
          style={headerStyle}
          className="text-[42px] font-extrabold text-[#1A1812] leading-tight tracking-tight mb-5"
        >
          Secure authentication
        </Animated.Text>

       
        <Animated.Text style={bodyStyle} className="text-[15px] text-[#7A7469] leading-relaxed mb-8">
          Manage your profile and settings in one place. Everything is encrypted and private.
        </Animated.Text>

        
        <Animated.View style={bodyStyle} className="h-px bg-[#DDD8CF] mb-7" />

       
        <Animated.View style={bodyStyle} className="flex-row items-center mb-12">
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-[#1A1812]">256</Text>
            <Text className="text-[11px] text-[#9C9189] mt-0.5 tracking-wide">bit encryption</Text>
          </View>

          <View className="w-1 h-1 rounded-full bg-[#C5B99A]" />

          <View className="flex-1 ml-4">
            <Text className="text-xl font-extrabold text-[#1A1812]">0</Text>
            <Text className="text-[11px] text-[#9C9189] mt-0.5 tracking-wide">data shared</Text>
          </View>

          <View className="w-1 h-1 rounded-full bg-[#C5B99A]" />

          <View className="flex-1 ml-4">
            <Text className="text-xl font-extrabold text-[#1A1812]">24/7</Text>
            <Text className="text-[11px] text-[#9C9189] mt-0.5 tracking-wide">availability</Text>
          </View>
        </Animated.View>

     
        <Animated.View style={btnStyle}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/private")}
            className="bg-[#1A1812] py-4 px-7 rounded-2xl flex-row items-center justify-between mb-4"
          >
            <Text className="text-[#F5F3EE] text-base font-bold">Sign out</Text>
            <Text className="text-[#9C8A6E] text-lg font-semibold">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("./about")}
            className="items-center py-3"
          >
            <Text className="text-[#9C9189] text-sm font-medium underline">
              Learn more
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}