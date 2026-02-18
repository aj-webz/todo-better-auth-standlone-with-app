//import  { serve } from "@hono/node-server"
import { handle } from "hono/vercel" 
import app from "./route";

export default handle(app);