import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./api-schema";

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NODE_ENV === "production"
    ? "https://todo-better-auth-standalone-server.vercel.app"
    : "http://localhost:3001",
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});

export const $api = createClient(fetchClient);  
export type { paths };