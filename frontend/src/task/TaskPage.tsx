import { useEffect, useState, type FormEvent } from "react";
import { tasksApi } from "../api/tasks";
import type { Task, TaskCreate } from "../types";

type Filter = "all" | "open" | "done";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "done", label: "Done" },
];

const PRIORITY = ["Low", "Normal", "High", "Urgent"];

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = async (next: Filter = filter) => {
    const completed = next === "all" ? undefined : next === "done";
    const items = await tasksApi.list(completed);
    setTasks(items);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    load(filter)
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load tasks");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
    setError(null);
    try {
      await tasksApi.update(task.id, { completed: !task.completed });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update task");
    }
  };

  const remove = async (id: number) => {
    setError(null);
    try {
      await tasksApi.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete task");
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="text-start">
          <h1 className="h3 mb-1">Tasks</h1>
          <p className="text-secondary mb-0">{loading ? "Loading…" : `${tasks.length} shown`}</p>
        </div>
        <div className="btn-group" role="group" aria-label="Filter tasks">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`btn ${filter === value ? "btn-primary" : "btn-outline-primary"}`}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form className="card shadow-sm mb-4" onSubmit={create}>
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label" htmlFor="task-title">Title</label>
              <input id="task-title" className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="task-description">Description</label>
              <input id="task-description" className="form-control" placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="task-due">Due</label>
              <input id="task-due" className="form-control" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="form-select" value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                {PRIORITY.map((label, value) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {!loading && tasks.length === 0 ? (
        <div className="card border-0 bg-light">
          <div className="card-body text-secondary">No tasks in this filter.</div>
        </div>
      ) : (
        <ul className="list-group shadow-sm">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex align-items-start gap-3">
              <input
                className="form-check-input mt-1"
                type="checkbox"
                checked={task.completed}
                aria-label={`Mark ${task.title} ${task.completed ? "open" : "done"}`}
                onChange={() => toggle(task)}
              />
              <div className="flex-grow-1 text-start">
                <div className={task.completed ? "text-decoration-line-through text-secondary" : "fw-medium"}>
                  {task.title}
                </div>
                {task.description && <div className="small text-secondary">{task.description}</div>}
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="badge text-bg-secondary">{PRIORITY[task.priority] ?? `P${task.priority}`}</span>
                  {task.due_date && <span className="badge text-bg-light border">Due {task.due_date}</span>}
                </div>
              </div>
              <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => remove(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
