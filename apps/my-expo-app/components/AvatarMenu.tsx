import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { authClient } from "@/lib/authClient";

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
        className="h-10 w-10 items-center justify-center rounded-full bg-[#9333EA]"
        onPress={() => setOpen(true)}
        style={{
          shadowColor: "#9333EA",
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text className="font-extrabold text-white text-xl">{initial}</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent visible={open}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          <View
            className="absolute top-24 right-5 overflow-hidden rounded-2xl bg-white"
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
              className="flex-row items-center border-[#F3F4F6] border-b px-4 py-3"
              style={{ gap: 10 }}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#9333EA]">
                <Text className="font-bold text-base text-white">
                  {initial}
                </Text>
              </View>
              <Text
                className="font-semibold text-gray-800 text-sm"
                numberOfLines={1}
              >
                {session?.user?.name ?? "User"}
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center border-[#F3F4F6] border-b px-4 py-3"
              onPress={handleDashboard}
              style={{ gap: 10 }}
            >
              <Ionicons color="#4338ca" name="bar-chart-outline" size={16} />
              <Text className="font-semibold text-indigo-700 text-sm">
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleSignOut}
              style={{ gap: 10 }}
            >
              <Ionicons color="#EF4444" name="log-out-outline" size={16} />
              <Text className="font-semibold text-red-500 text-sm">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
