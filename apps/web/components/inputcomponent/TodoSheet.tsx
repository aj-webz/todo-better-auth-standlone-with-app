"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateTodoFormInput, CreateTodoFormSchema } from "@repo/shared";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useCreateTodo } from "@/hooks/queryhook";

export function CreateTodoSheet(): React.ReactElement {
  const createTodo = useCreateTodo();
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateTodoFormInput>({
    resolver: zodResolver(CreateTodoFormSchema),
    defaultValues: {
      title: "",
      description: "Enter your description",
      dueDate: new Date(),
      dueTime: "00:00:00",
    },
  });

  const onSubmit: SubmitHandler<CreateTodoFormInput> = (values) => {
    console.log("FORM VALUES (raw):", values);

    const timeParts = values.dueTime.split(":").map(Number);
    const h = timeParts[0] ?? 0;
    const m = timeParts[1] ?? 0;
    const s = timeParts[2] ?? 0;

    const endAt = new Date(values.dueDate);
    endAt.setHours(h, m, s, 0);

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
          console.log("Todo created!");
          form.reset({
            title: "",
            description: "",
            dueDate: new Date(),
            dueTime: "00:00:00",
          });
          setOpen(false);
        },
        onError: (err) => {
          const message =
            typeof err === "object" && err !== null && "error" in err
              ? (err as { error: string }).error
              : "Failed to create todo";
          window.alert(`${message}`);
        },
      }
    );
  };

  const dueDate = form.watch("dueDate");
  const dueTime = form.watch("dueTime");

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="flex w-full flex-col p-5 sm:max-w-md"
      >
        <SheetHeader className="space-y-2 border-b pb-3">
          <SheetTitle>Create Todo</SheetTitle>
        </SheetHeader>

        <form
          className="flex flex-1 flex-col gap-6 pt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="w-full justify-start"
                  type="button"
                  variant="outline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {dueDate ? format(dueDate, "dd MMM yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }
                    form.setValue("dueDate", date, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  selected={dueDate}
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dueDate && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Due Time</Label>
            <Input
              id="time"
              onChange={(e) => {
                const value = e.target.value;
                // ✅ Normalize to HH:mm:ss
                const normalized = value.length === 5 ? `${value}:00` : value;
                form.setValue("dueTime", normalized, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              step={1}
              type="time"
              value={dueTime}
            />
            {form.formState.errors.dueTime && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.dueTime.message}
              </p>
            )}
          </div>

          <SheetFooter className="mt-auto flex gap-4">
            <Button disabled={createTodo.isPending} type="submit">
              {createTodo.isPending ? "Creating…" : "Create Todo"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
