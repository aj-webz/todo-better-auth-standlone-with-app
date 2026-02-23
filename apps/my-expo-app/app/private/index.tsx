import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTodoButton, CreateTodoSheet } from "@/components/TodoSheet";
import TodoList from "@/components/TodoList";
import CardLayout from "@/components/DashStatus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

export default function PrivateScreen() {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6">
          <View className="p-20 items-center">
            <Text className="text-2.5xl font-semibold tracking-widest text-indigo-900 uppercase mb-2">
              Have a <Text className="text-xl text-indigo-400">Great day!</Text>
            </Text>
          </View>
          <CardLayout />
          <TodoList />
        </View>
      </ScrollView>

      
      <View style={{ position: "absolute", right: 24, bottom: insets.bottom + 16 }}>
        <AddTodoButton onPress={() => sheetRef.current?.expand()} />
      </View>

  
      <CreateTodoSheet sheetRef={sheetRef} />
    </SafeAreaView>
  );
}