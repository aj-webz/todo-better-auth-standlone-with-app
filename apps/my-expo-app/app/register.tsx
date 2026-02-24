import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
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

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (error) {
        Alert.alert("Registration Failed", error.message);
        return;
      }

      Alert.alert("Success", "Account created successfully!", [{ text: "OK" }]);
    } catch (err) {
      console.error("REGISTER EXCEPTION:", err);

      const message =
        err instanceof Error ? err.message : "Something went wrong";

      Alert.alert("Registration Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          <Text className="mb-2 text-center font-bold text-3xl text-black">
            Create Account
          </Text>
          <Text className="mb-8 text-center text-gray-500 text-sm">
            Sign up to get started
          </Text>

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700 text-sm">
              Name
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`rounded-xl border px-4 py-3 text-black text-sm ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter your name"
                  placeholderTextColor="#9ca3af"
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text className="mt-1 text-red-500 text-xs">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Email */}
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
                  placeholder="Enter your email"
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

          <View className="mb-4">
            <Text className="mb-1 font-semibold text-gray-700 text-sm">
              Password
            </Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className={`rounded-xl border px-4 py-3 pr-14 text-black text-sm ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={value}
                  />

                  <TouchableOpacity
                    className="absolute inset-y-0 right-4 justify-center"
                    hitSlop={{
                      top: 10,
                      bottom: 10,
                      left: 10,
                      right: 10,
                    }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      color="#6b7280"
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                    />
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

          <View className="mb-6">
            <Text className="mb-1 font-semibold text-gray-700 text-sm">
              Confirm Password
            </Text>

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className={`rounded-xl border px-4 py-3 pr-14 text-black text-sm ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                  />

                  <TouchableOpacity
                    className="absolute inset-y-0 right-4 justify-center"
                    hitSlop={{
                      top: 10,
                      bottom: 10,
                      left: 10,
                      right: 10,
                    }}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      color="#6b7280"
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            {errors.confirmPassword && (
              <Text className="mt-1 text-red-500 text-xs">
                {errors.confirmPassword.message}
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
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Link asChild href="/login">
            <TouchableOpacity className="mt-6 items-center">
              <Text className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Text className="font-semibold text-black">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
