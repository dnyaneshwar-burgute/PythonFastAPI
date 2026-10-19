import { request } from "./client";
import type { Task, TaskCreate, TaskUpdate } from "../types";

const BASE = "/api/tasks";

export const tasksApi = {
  list: (completed?: boolean) =>
    request<Task[]>(completed === undefined ? BASE : `${BASE}?completed=${completed}`),
  create: (data: TaskCreate) =>
    request<Task>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: TaskUpdate) =>
    request<Task>(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
