"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz"
import { CalendarIcon, Plus } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";

import { useCreateTodo } from "@/hooks/queryhook";
import {
  CreateTodoFormSchema,
  type CreateTodoFormInput,
} from "@repo/shared";
import { formatToIST } from "@/lib/date-utils";

export function CreateTodoSheet(): React.ReactElement {
  const createTodo = useCreateTodo();
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateTodoFormInput>({
    resolver: zodResolver(CreateTodoFormSchema),
    defaultValues: {
      title: "Add Task name",
      description: "Enter task description",
      dueDate: new Date(),
      dueTime: "00:00:00",
    },
  });

  const onSubmit: SubmitHandler<CreateTodoFormInput> = (values) => {
    console.log("FORM VALUES (raw):", values);
    const parts = values.dueTime.split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const s = Number(parts[2]);
    const combinedDate = new Date(values.dueDate);
    combinedDate.setHours(h, m, s, 0);
    const payLoad =
    {
      ...values,
      dueDate: combinedDate.toISOString(),
    } as unknown as CreateTodoFormInput
    console.log("SENDING TO API (ISO):", payLoad.dueDate);
    console.log()
    createTodo.mutate(payLoad, {
      onSuccess: () => {
        form.reset({
          title: "",
          description: "",
          dueDate: new Date(),
          dueTime: "00:00:00",
        });
        setOpen(false);
      },
      onError: (err) => {
        console.error("CREATE TODO FAILED:", err);
      },
    });
  };

  const dueDate = form.watch("dueDate");
  const dueTime = form.watch("dueTime");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-5 sm:max-w-md">
        <SheetHeader className="space-y-2 pb-3 border-b">
          <SheetTitle>Create Todo</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-10 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>


          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn("justify-start")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatToIST(dueDate, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  if (!date) return;
                  form.setValue("dueDate", date, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Due Time</Label>
            <Input
              id="time"
              type="time"
              step={1}
              value={dueTime.slice(0, 5)}
              onChange={(e) => {
                const value = e.target.value;
                const normalized =
                  value.length === 5 ? `${value}:00` : value;

                form.setValue("dueTime", normalized, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </div>

          <SheetFooter className="mt-auto flex gap-4">
            <Button type="submit" disabled={createTodo.isPending}>
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
