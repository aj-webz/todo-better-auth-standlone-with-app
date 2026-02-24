import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error("Not found env");
}
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL!,
  plugins: [
    expoClient({
      scheme: "my-expo-app",
      storagePrefix: "my-expo-app",
      storage: SecureStore,
    }),
  ],
});
