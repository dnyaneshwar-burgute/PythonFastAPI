import { request, tokenStore } from "./client";
import type { Token, User } from "../types";

export const authApi = {
  register: (email: string, username: string, password: string) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    }),

  login: async (email: string, password: string) => {
    const body = new URLSearchParams({ username: email, password });
    const token = await request<Token>("/api/auth/login", { method: "POST", body });
    tokenStore.set(token.access_token);
    return token;
  },

  me: () => request<User>("/api/auth/me"),

  logout: () => tokenStore.clear(),
};
