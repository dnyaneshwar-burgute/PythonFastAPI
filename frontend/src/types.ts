export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  priority: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export type TaskCreate = Pick<Task, "title"> &
  Partial<Pick<Task, "description" | "due_date" | "priority">>;
export type TaskUpdate = Partial<
  Pick<Task, "title" | "description" | "completed" | "due_date" | "priority">
>;

export interface Token {
  access_token: string;
  token_type: string;
}
