import { z } from "zod";

const TodoStatusEnum = z.enum([
  "todo",
  "in-progress",
  "backlog",
  "completed",
  "cancelled",
]);

const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: TodoStatusEnum,
  completed: z.boolean(),
  createdAt: z.string(),
  endAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});

const CreateTodoFormSchema = z.object({
  title: z.string().min(1, "Title is required !"),
  description: z.string().min(1, "Don't you know about your task!!"),
  dueDate: z.date(),
  dueTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Time must be HH:mm or HH:mm:ss"
    ),
});

const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  endAt: z.string().datetime(),
});

const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const LoginSchema = z.object({
  email: z.email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const ErrorSchema = z.object({
  error: z.string(),
});

const MessageSchema = z.object({
  message: z.string(),
});

const sessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: z.object({
    sub: z.string(),
    email: z.string(),
    role: z.enum(["user", "admin"]),
    exp: z.number(),
  }),
});

export {
  TodoStatusEnum,
  TodoSchema,
  CreateTodoFormSchema,
  CreateTodoSchema,
  RegisterSchema,
  LoginSchema,
  sessionResponseSchema,
  ErrorSchema,
  MessageSchema,
};

export type TodoStatus = z.infer<typeof TodoStatusEnum>;
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoFormInput = z.infer<typeof CreateTodoFormSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
