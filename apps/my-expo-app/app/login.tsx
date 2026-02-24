import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod/v4";
import { authClient } from "@/lib/authClient";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      console.log("LOGIN RESULT:", result);

      if (result?.error) {
        Alert.alert("Login Failed", result.error.message);
        return;
      }

      console.log("LOGIN SUCCESS:", result?.data);
    } catch (err) {
      console.error("LOGIN EXCEPTION:", err);

      const message =
        err instanceof Error ? err.message : "Something went wrong";

      Alert.alert("Login Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-center font-bold text-3xl text-black">
          Welcome Back
        </Text>
        <Text className="mb-8 text-center text-gray-500 text-sm">
          Sign in to your account
        </Text>

        <View className="mb-4">
          <Text className="mb-1 font-semibold text-gray-700 text-sm">
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoCapitalize="none"
                className={`rounded-xl border px-4 py-3 text-black text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter email"
                placeholderTextColor="#9ca3af"
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-red-500 text-xs">
              {errors.email.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-1 font-semibold text-gray-700 text-sm">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`flex-row items-center rounded-xl border px-4 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              >
                <TextInput
                  className="flex-1 py-3 text-black text-sm"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={value}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text className="font-semibold text-gray-500 text-xs">
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text className="mt-1 text-red-500 text-xs">
              {errors.password.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className={`items-center rounded-xl py-4 ${
            isSubmitting ? "bg-gray-400" : "bg-black"
          }`}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="font-semibold text-base text-white">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <Link asChild href={"/register"}>
          <TouchableOpacity className="mt-6 items-center">
            <Text className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Text className="font-semibold text-black">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
