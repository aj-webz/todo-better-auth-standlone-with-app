import { expo } from "@better-auth/expo";
import { account, getDb, session, user } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

console.log("BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET);
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      user,
      session,
      account,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://todo-better-auth-standlone-with-app.vercel.app",
    "https://todo-better-auth-standalone-server-sage.vercel.app",
    "https://todo-better-auth-standalone-web.vercel.app",
    "my-expo-app://",
    "exp://**",
    "http://192.168.1.16:3000",
    "http://192.168.1.5:3000",
  ],
  plugins: [expo()],
  advanced: {
    crossOriginCookies: true,
    //trustedProxyHeaders: true,
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
});
