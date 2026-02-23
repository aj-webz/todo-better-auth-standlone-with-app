import createClient, { type Middleware } from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";
import type { paths } from "./api-schema";
import { authClient } from "./authClient";

const client = createClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  credentials: "omit",
});

const authMiddleware: Middleware = {
  onRequest(options) {
    const cookies = authClient.getCookie();
    options.request.headers.set("Cookie", cookies);
    return options.request;
  },
};

client.use(authMiddleware);

export const $api = createReactQueryClient(client);
export type { paths };