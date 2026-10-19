import { useEffect, useState, type FormEvent } from "react";
import { tasksApi } from "../api/tasks";
import type { Task, TaskCreate } from "../types";

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = async (next = filter) => {
    const completed = next === "all" ? undefined : next === "done";
    setTasks(await tasksApi.list(completed));
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load tasks"));
  }, [filter]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const data: TaskCreate = {
      title,
      description: description || undefined,
      due_date: dueDate || undefined,
      priority,
    };
    try {
      await tasksApi.create(data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority(0);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task");
    }
  };

  const toggle = async (task: Task) => {
    await tasksApi.update(task.id, { completed: !task.completed });
    await load();
  };

  const remove = async (id: number) => {
    await tasksApi.remove(id);
    await load();
  };

  return (
    <section>
      <h2>Tasks</h2>
      <form onSubmit={create}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input type="number" min={0} max={3} value={priority} onChange={(e) => setPriority(Number(e.target.value))} />
        <button type="submit">Add task</button>
      </form>
      <div>
        {(["all", "open", "done"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} disabled={filter === value}>
            {value}
          </button>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input type="checkbox" checked={task.completed} onChange={() => toggle(task)} />
              {task.title}
            </label>
            {task.description && <p>{task.description}</p>}
            {task.due_date && <p>Due {task.due_date}</p>}
            <p>Priority {task.priority}</p>
            <button type="button" onClick={() => remove(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
