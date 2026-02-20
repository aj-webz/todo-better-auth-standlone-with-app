import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { authClient } from "@/lib/authClient";
import { Link, router } from "expo-router";

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
  const result = await authClient.signIn.email({
    email: values.email,
    password: values.password,
  });

  console.log("LOGIN RESULT:", result);

  if (result.error) {
    Alert.alert("Login Failed", result.error.message);
    return;
  }
  //router.replace("/private")
  console.log("LOGIN SUCCESS:", result.data);
};

  return (
    <View className="flex-1 justify-center px-6 bg-white">

      <Text className="text-3xl font-bold text-center text-black mb-2">
        Welcome Back
      </Text>
      <Text className="text-sm text-center text-gray-500 mb-8">
        Sign in to your account
      </Text>

      
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border rounded-xl px-4 py-3 text-sm text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
        )}
      </View>

    
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className={`flex-row items-center border rounded-xl px-4 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}>
              <TextInput
                className="flex-1 py-3 text-sm text-black"
                placeholder="Enter password"
                placeholderTextColor="#9ca3af"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword} 
              />
            
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-xs text-gray-500 font-semibold">
                  {showPassword ? "HIDE" : "SHOW"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>
        )}
      </View>

  
      <TouchableOpacity
        className={`py-4 rounded-xl items-center ${
          isSubmitting ? "bg-gray-400" : "bg-black"
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text className="text-white font-semibold text-base">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <Link href={"/register"} asChild>
        <TouchableOpacity className="mt-6 items-center">
          <Text className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Text className="text-black font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Link>

    </View>
  );
}