import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import "global.css";
import { authClient } from "@/lib/authClient";
import { Text } from "react-native"

export default function Layout()
{
  const { data:session , isPending } = authClient.useSession();
  const islogged = !!session;
  console.log("logging in layout:",islogged);


  if(isPending)
  {
    return( 
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
    </View>
    )
  }


return (
  <Stack screenOptions={{ headerShown: false }}>
    

    <Stack.Protected guard={islogged}>
      <Stack.Screen name="index" />
      <Stack.Screen name="private" />
    </Stack.Protected>{/*fall back*/}

      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
  </Stack>
);
}