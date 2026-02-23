import * as React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  Platform, Alert, KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { $api } from "@/lib/api-client";
import { CreateTodoFormSchema, type CreateTodoFormInput } from "@repo/shared";


export function AddTodoButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-2 bg-white px-4 py-2.5 rounded-lg"
      onPress={onPress}
    >
      <Plus color="#000" size={18} />
      <Text className="text-black font-semibold shadow-2xs border-s-fuchsia-950 text-sm">Add Todo</Text>
    </TouchableOpacity>
  );
}


export function CreateTodoSheet({ sheetRef }: { sheetRef: React.RefObject<BottomSheet | null> }) {
  const queryClient = useQueryClient();
  const createTodo = $api.useMutation("post", "/api/todos", {
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const snapPoints = React.useMemo(() => ["75%", "92%"], []);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const form = useForm<CreateTodoFormInput>({
    resolver: zodResolver(CreateTodoFormSchema),
    defaultValues: { title: "", description: "", dueDate: new Date(), dueTime: "00:00:00" },
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
      { body: { title: values.title, description: values.description, endAt: endAt.toISOString() } },
      {
        onSuccess: () => {
          form.reset({ title: "", description: "", dueDate: new Date(), dueTime: "00:00:00" });
          closeSheet();
        },
        onError: (err) => {
          const message = typeof err === "object" && err !== null && "error" in err
            ? (err as { error: string }).error : "Failed to create todo";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const renderBackdrop = React.useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(i) => { if (i === -1) { setShowDatePicker(false); setShowTimePicker(false); } }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <BottomSheetScrollView contentContainerClassName="px-5 pb-10">
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-lg font-bold text-gray-900">Create Todo</Text>
            <TouchableOpacity onPress={closeSheet}>
              <Text className="text-sm text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
          <View className="h-px bg-gray-200 mb-5" />

          {/* Title */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Title</Text>
            <Controller control={form.control} name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white ${form.formState.errors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter title" placeholderTextColor="#9CA3AF"
                  onBlur={onBlur} onChangeText={onChange} value={value}
                />
              )}
            />
            {form.formState.errors.title && <Text className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</Text>}
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Description</Text>
            <Controller control={form.control} name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white min-h-24 ${form.formState.errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter description" placeholderTextColor="#9CA3AF"
                  onBlur={onBlur} onChangeText={onChange} value={value}
                  multiline numberOfLines={4} textAlignVertical="top"
                />
              )}
            />
            {form.formState.errors.description && <Text className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</Text>}
          </View>

          {/* Due Date */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Due Date</Text>
            <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white"
              onPress={() => { setShowTimePicker(false); setShowDatePicker((p) => !p); }}>
              <Text className="text-sm text-gray-700">📅 {dueDate ? format(dueDate, "dd MMM yyyy") : "Pick a date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={dueDate ?? new Date()} mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(_, d) => { if (Platform.OS === "android") setShowDatePicker(false); if (d) form.setValue("dueDate", d, { shouldValidate: true, shouldDirty: true }); }}
              />
            )}
          </View>

          {/* Due Time */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Due Time</Text>
            <TouchableOpacity className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white"
              onPress={() => { setShowDatePicker(false); setShowTimePicker((p) => !p); }}>
              <Text className="text-sm text-gray-700">🕐 {dueTime ?? "00:00:00"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={dueTimeAsDate} mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"} is24Hour
                onChange={(_, t) => {
                  if (Platform.OS === "android") setShowTimePicker(false);
                  if (t) {
                    const h = String(t.getHours()).padStart(2, "0");
                    const m = String(t.getMinutes()).padStart(2, "0");
                    const s = String(t.getSeconds()).padStart(2, "0");
                    form.setValue("dueTime", `${h}:${m}:${s}`, { shouldValidate: true, shouldDirty: true });
                  }
                }}
              />
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            className={`bg-gray-900 rounded-lg py-3.5 items-center mt-2 ${createTodo.isPending ? "opacity-50" : "opacity-100"}`}
            onPress={form.handleSubmit(onSubmit)} disabled={createTodo.isPending}
          >
            <Text className="text-white font-semibold text-base">
              {createTodo.isPending ? "Creating…" : "Create Todo"}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}