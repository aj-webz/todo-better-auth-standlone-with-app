import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// export const userRoleEnum  =  pgEnum("user_role",["user","admin"]);
// export const users = pgTable("users",
//   {
//     id: uuid("id").primaryKey().defaultRandom(),
//     email: text("email").notNull().unique(),
//     password:text("password").notNull(),
//     role:userRoleEnum("role").notNull().default("user"),
//     createdAt:timestamp("created_at").defaultNow().notNull(),
//   }
// )
const todoStatusEnum = pgEnum("todo_status", [
  "todo",
  "in-progress",
  "backlog",
  "completed",
  "cancelled",
]);

const todos = pgTable("todoworker", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: todoStatusEnum("status").notNull().default("todo"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  endAt: timestamp("end_at", { withTimezone: true, mode: "date" }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
});

export { todoStatusEnum, todos };
