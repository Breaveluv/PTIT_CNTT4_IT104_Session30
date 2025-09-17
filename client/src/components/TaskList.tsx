// TaskList.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLoading } from "./LoadingProvider";

interface Task {
  id: number;
  name: string;
  status: "done" | "todo" | string;
}

export default function TaskList() {
  const { setLoading } = useLoading();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Lấy dữ liệu từ server
  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Task[]>("http://localhost:8080/todos");
      setTasks(res.data || []);
    } catch (err: any) {
      console.error("Fetch tasks error:", err);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();

    function onAdded(e: Event) {
      try {
        const ce = e as CustomEvent<Task>;
        const newTask = ce?.detail;
        if (newTask && (newTask as any).id != null) {
          setTasks((prev) => [newTask, ...prev]);
          setNewlyAddedId((newTask as any).id);
          setTimeout(() => setNewlyAddedId(null), 3000);
          setTimeout(() => {
            if (listRef.current) listRef.current.scrollTop = 0;
          }, 50);
        } else {
          fetchTasks();
        }
      } catch (err) {
        fetchTasks();
      }
    }

    function onRefresh() {
      fetchTasks();
    }

    window.addEventListener("todo:added", onAdded as EventListener);
    window.addEventListener("todo:refresh", onRefresh as EventListener);

    return () => {
      window.removeEventListener("todo:added", onAdded as EventListener);
      window.removeEventListener("todo:refresh", onRefresh as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle trạng thái
  async function handleToggleStatus(task: Task): Promise<void> {
    const nextStatus = task.status === "done" ? "todo" : "done";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      await axios.patch(`http://localhost:8080/todos/${task.id}`, { status: nextStatus });
    } catch (err) {
      console.error("Update status failed", err);
      alert("Cập nhật trạng thái thất bại");
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    }
  }

  // Xóa task
  async function handleDelete(taskId: number): Promise<void> {
    if (!confirm("Bạn có chắc muốn xóa công việc này?")) return;
    const old = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await axios.delete(`http://localhost:8080/todos/${taskId}`);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Xóa thất bại");
      setTasks(old);
    }
  }

  // Chỉnh tên
  async function handleEdit(task: Task): Promise<void> {
    const newName = prompt("Chỉnh tên công việc:", task.name);
    if (newName == null) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      alert("Tên không được để trống");
      return;
    }
    const prev = tasks;
    setTasks((prevList) => prevList.map((t) => (t.id === task.id ? { ...t, name: trimmed } : t)));
    try {
      await axios.put(`http://localhost:8080/todos/${task.id}`, { ...task, name: trimmed });
    } catch (err) {
      console.error("Edit failed", err);
      alert("Cập nhật thất bại");
      setTasks(prev);
    }
  }

  if (error) {
    return (
      <div style={{ marginBottom: 18, color: "#ef4444" }}>
        Lỗi: {error} <button onClick={fetchTasks} style={{ marginLeft: 12 }}>Thử lại</button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "#fff",
            border: "1px solid rgba(16,24,40,0.04)",
          }}
        >
          Chưa có công việc nào.
          <button
            onClick={fetchTasks}
            style={{
              marginLeft: 12,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid rgba(16,24,40,0.06)",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 18,
        maxHeight: 480,
        overflow: "auto",
        paddingRight: 6,
      }}
    >
      {tasks.map((task) => {
        const checked = task.status === "done";
        const isNew = newlyAddedId === task.id;
        return (
          <div
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 8,
              background: isNew ? "linear-gradient(90deg,#f0f9ff,#ffffff)" : "#fff",
              border: "1px solid rgba(16,24,40,0.04)",
              boxShadow: isNew ? "0 6px 18px rgba(37,99,235,0.08)" : "0 2px 8px rgba(16,24,40,0.02)",
              transition: "background 220ms ease, box-shadow 220ms ease",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggleStatus(task)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <div style={{ fontSize: 15, ...(checked ? { textDecoration: "line-through", color: "#9aa6b3" } : {}) }}>
                {task.name}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleEdit(task)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px solid rgba(16,24,40,0.04)",
                  background: "transparent",
                  color: "#f59e0b",
                }}
                aria-label={`Sửa ${task.name}`}
              >
                ✏️
              </button>

              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px solid rgba(16,24,40,0.04)",
                  background: "transparent",
                  color: "#ef4444",
                }}
                aria-label={`Xóa ${task.name}`}
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}