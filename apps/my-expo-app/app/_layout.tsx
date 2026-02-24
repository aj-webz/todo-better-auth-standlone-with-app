import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AvatarMenu from "@/components/AvatarMenu";
import { authClient } from "@/lib/authClient";
import { Provider } from "@/lib/query-provider";

function Layout() {
  const { data: session, isPending } = authClient.useSession();
  const islogged = !!session;

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: islogged,
        headerStyle: { backgroundColor: "#000000" },
        headerShadowVisible: false,
        headerTitle: "",
        headerTintColor: "#CF9FFF",
        headerRight: () => (
          <View style={{ marginRight: 16, marginBottom: 5 }}>
            <AvatarMenu />
          </View>
        ),
      }}
    >
      <Stack.Protected guard={islogged}>
        <Stack.Screen name="index" />
        <Stack.Screen name="private" />
      </Stack.Protected>

      <Stack.Protected guard={!islogged}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <Provider>
          <Layout />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
