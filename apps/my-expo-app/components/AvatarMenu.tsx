import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AvatarMenu() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const initial = session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleSignOut = async () => {
    setOpen(false);
    await authClient.signOut();
  };

  const handleDashboard = () => {
    setOpen(false);
    router.push("/private/dashboard");
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="w-10 h-10 rounded-full bg-[#9333EA] items-center justify-center"
        style={{
          shadowColor: "#9333EA",
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text className="text-white font-extrabold text-xl">{initial}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          <View
            className="absolute top-24 right-5 bg-white rounded-2xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              minWidth: 180,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
       
            <View
              className="px-4 py-3 border-b border-[#F3F4F6] flex-row items-center"
              style={{ gap: 10 }}
            >
              <View className="w-9 h-9 rounded-full bg-[#9333EA] items-center justify-center">
                <Text className="text-white font-bold text-base">{initial}</Text>
              </View>
              <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>
                {session?.user?.name ?? "User"}
              </Text>
            </View>

       
            <TouchableOpacity
              onPress={handleDashboard}
              className="px-4 py-3 border-b border-[#F3F4F6] flex-row items-center"
              style={{ gap: 10 }}
            >
              <Ionicons name="bar-chart-outline" size={16} color="#4338ca" />
              <Text className="text-indigo-700 text-sm font-semibold">Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignOut}
              className="px-4 py-3 flex-row items-center"
              style={{ gap: 10 }}
            >
              <Ionicons name="log-out-outline" size={16} color="#EF4444" />
              <Text className="text-red-500 text-sm font-semibold">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}