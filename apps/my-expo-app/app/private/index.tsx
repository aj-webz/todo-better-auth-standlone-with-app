
import { View, Text, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/authClient"

export default function PrivateScreen() {
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">

    
      <View className="w-20 h-20 rounded-full bg-black items-center justify-center mb-4">
        <Text className="text-white text-3xl font-bold">
          {session?.user.name?.charAt(0).toUpperCase()}
        </Text>
      </View>

    
      <Text className="text-2xl font-bold text-black mb-1">
        {session?.user.name}
      </Text>
      <Text className="text-sm text-gray-500 mb-12">
        {session?.user.email}
      </Text>

   
      <TouchableOpacity
        className="bg-red-500 py-4 rounded-xl w-full items-center"
        onPress={handleSignOut}
      >
        <Text className="text-white font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>

    </View>
  );
}