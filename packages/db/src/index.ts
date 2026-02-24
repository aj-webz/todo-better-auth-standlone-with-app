import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { account, session, user } from "./auth-schema";
import { todoStatusEnum, todos } from "./schema";

dotenv.config({ path: "../../.env" });

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (db) {
    return db;
  }

  const DATABASE_URL = process.env.DATABASE_URL;
  console.log("DATABASE_URL:", DATABASE_URL ? "found" : "MISSING");
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const isLocal =
    DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

  const client = postgres(DATABASE_URL, {
    max: 1,
    prepare: false,
    ssl: isLocal ? false : "require",
    idle_timeout: 20,
    connect_timeout: 30,
  });

  db = drizzle(client, {
    schema: { todos, todoStatusEnum, user, account, session },
  });
  return db;
}
export { user, session, account };
export { todos } from "./schema";
