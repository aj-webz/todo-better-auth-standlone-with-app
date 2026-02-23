import { handle } from "hono/vercel";
import app from "@repo/api";

export const runtime = "nodejs";
export default handle(app);
