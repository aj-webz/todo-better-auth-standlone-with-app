import type BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CardLayout from "@/components/DashStatus";
import TodoList from "@/components/TodoList";
import { AddTodoButton, CreateTodoSheet } from "@/components/TodoSheet";

export default function PrivateScreen() {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6">
          <View className="items-center p-20">
            <Text className="mb-2 font-semibold text-2.5xl text-indigo-900 uppercase tracking-widest">
              Have a <Text className="text-indigo-400 text-xl">Great day!</Text>
            </Text>
          </View>
          <CardLayout />
          <TodoList />
        </View>
      </ScrollView>

      <View
        style={{ position: "absolute", right: 24, bottom: insets.bottom + 16 }}
      >
        <AddTodoButton onPress={() => sheetRef.current?.expand()} />
      </View>

      <CreateTodoSheet sheetRef={sheetRef} />
    </SafeAreaView>
  );
}
