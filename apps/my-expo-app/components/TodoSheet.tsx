import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { type CreateTodoFormInput, CreateTodoFormSchema } from "@repo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus } from "lucide-react-native";
import * as React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { $api } from "@/lib/api-client";

export function AddTodoButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-2 rounded-lg bg-white px-4 py-2.5"
      onPress={onPress}
    >
      <Plus color="#000" size={18} />
      <Text className="border-s-fuchsia-950 font-semibold text-black text-sm shadow-2xs">
        Add Todo
      </Text>
    </TouchableOpacity>
  );
}

export function CreateTodoSheet({
  sheetRef,
}: {
  sheetRef: React.RefObject<BottomSheet | null>;
}) {
  const queryClient = useQueryClient();
  const createTodo = $api.useMutation("post", "/api/todos", {
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const snapPoints = React.useMemo(() => ["75%", "92%"], []);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const form = useForm<CreateTodoFormInput>({
    resolver: zodResolver(CreateTodoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      dueTime: "00:00:00",
    },
  });

  const dueDate = form.watch("dueDate");
  const dueTime = form.watch("dueTime");

  const dueTimeAsDate = React.useMemo(() => {
    const parts = dueTime.split(":").map(Number);
    const d = new Date();
    d.setHours(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, 0);
    return d;
  }, [dueTime]);

  const closeSheet = () => {
    sheetRef.current?.close();
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const onSubmit: SubmitHandler<CreateTodoFormInput> = (values) => {
    const timeParts = values.dueTime.split(":").map(Number);
    const endAt = new Date(values.dueDate);
    endAt.setHours(timeParts[0] ?? 0, timeParts[1] ?? 0, timeParts[2] ?? 0, 0);

    createTodo.mutate(
      {
        body: {
          title: values.title,
          description: values.description,
          endAt: endAt.toISOString(),
        },
      },
      {
        onSuccess: () => {
          form.reset({
            title: "",
            description: "",
            dueDate: new Date(),
            dueTime: "00:00:00",
          });
          closeSheet();
        },
        onError: (err) => {
          const message =
            typeof err === "object" && err !== null && "error" in err
              ? (err as { error: string }).error
              : "Failed to create todo";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      index={-1}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onChange={(i) => {
        if (i === -1) {
          setShowDatePicker(false);
          setShowTimePicker(false);
        }
      }}
      ref={sheetRef}
      snapPoints={snapPoints}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <BottomSheetScrollView contentContainerClassName="px-5 pb-10">
          <View className="flex-row items-center justify-between py-4">
            <Text className="font-bold text-gray-900 text-lg">Create Todo</Text>
            <TouchableOpacity onPress={closeSheet}>
              <Text className="text-gray-500 text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
          <View className="mb-5 h-px bg-gray-200" />

          {/* Title */}
          <View className="mb-5">
            <Text className="mb-1.5 font-medium text-gray-700 text-sm">
              Title
            </Text>
            <Controller
              control={form.control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`rounded-lg border bg-white px-3 py-2.5 text-gray-900 text-sm ${form.formState.errors.title ? "border-red-500" : "border-gray-300"}`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter title"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                />
              )}
            />
            {form.formState.errors.title && (
              <Text className="mt-1 text-red-500 text-xs">
                {form.formState.errors.title.message}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="mb-1.5 font-medium text-gray-700 text-sm">
              Description
            </Text>
            <Controller
              control={form.control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`min-h-24 rounded-lg border bg-white px-3 py-2.5 text-gray-900 text-sm ${form.formState.errors.description ? "border-red-500" : "border-gray-300"}`}
                  multiline
                  numberOfLines={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter description"
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                  value={value}
                />
              )}
            />
            {form.formState.errors.description && (
              <Text className="mt-1 text-red-500 text-xs">
                {form.formState.errors.description.message}
              </Text>
            )}
          </View>

          {/* Due Date */}
          <View className="mb-5">
            <Text className="mb-1.5 font-medium text-gray-700 text-sm">
              Due Date
            </Text>
            <TouchableOpacity
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5"
              onPress={() => {
                setShowTimePicker(false);
                setShowDatePicker((p) => !p);
              }}
            >
              <Text className="text-gray-700 text-sm">
                📅 {dueDate ? format(dueDate, "dd MMM yyyy") : "Pick a date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                display={Platform.OS === "ios" ? "inline" : "default"}
                mode="date"
                onChange={(_, d) => {
                  if (Platform.OS === "android") {
                    setShowDatePicker(false);
                  }
                  if (d) {
                    form.setValue("dueDate", d, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
                value={dueDate ?? new Date()}
              />
            )}
          </View>

          {/* Due Time */}
          <View className="mb-5">
            <Text className="mb-1.5 font-medium text-gray-700 text-sm">
              Due Time
            </Text>
            <TouchableOpacity
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5"
              onPress={() => {
                setShowDatePicker(false);
                setShowTimePicker((p) => !p);
              }}
            >
              <Text className="text-gray-700 text-sm">
                🕐 {dueTime ?? "00:00:00"}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour
                mode="time"
                onChange={(_, t) => {
                  if (Platform.OS === "android") {
                    setShowTimePicker(false);
                  }
                  if (t) {
                    const h = String(t.getHours()).padStart(2, "0");
                    const m = String(t.getMinutes()).padStart(2, "0");
                    const s = String(t.getSeconds()).padStart(2, "0");
                    form.setValue("dueTime", `${h}:${m}:${s}`, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
                value={dueTimeAsDate}
              />
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            className={`mt-2 items-center rounded-lg bg-gray-900 py-3.5 ${createTodo.isPending ? "opacity-50" : "opacity-100"}`}
            disabled={createTodo.isPending}
            onPress={form.handleSubmit(onSubmit)}
          >
            <Text className="font-semibold text-base text-white">
              {createTodo.isPending ? "Creating…" : "Create Todo"}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
