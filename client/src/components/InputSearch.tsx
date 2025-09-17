// InputSearch.tsx
import React, { useState } from "react";
import axios from "axios";
import { useLoading } from "./LoadingProvider";

type Task = {
  id?: number;
  name: string;
  status?: "todo" | "done" | string;
};

type Props = {
  onAdded?: (task: Task) => void;
};

export default function InputSearch({ onAdded }: Props) {
  const [text, setText] = useState("");
  const { isLoading, setLoading } = useLoading(); // Thêm isLoading

  async function handleAdd() {
    const name = text.trim();
    if (!name) {
      alert("Vui lòng nhập tên công việc");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/todos", {
        name,
        status: "todo",
      });

      const newTask: Task | undefined = res?.data;

      if (newTask && (newTask as any).id != null) {
        try {
          window.dispatchEvent(new CustomEvent("todo:added", { detail: newTask }));
        } catch (e) {
          (window as any).dispatchEvent((new (window as any).CustomEvent)("todo:added", { detail: newTask }));
        }

        if (onAdded) onAdded(newTask);
      } else {
        try {
          window.dispatchEvent(new CustomEvent("todo:refresh"));
        } catch (e) {
          (window as any).dispatchEvent((new (window as any).CustomEvent)("todo:refresh"));
        }
        if (onAdded) onAdded({ name, status: "todo" });
      }

      setText("");
      (document.activeElement as HTMLElement | null)?.blur();
    } catch (err: any) {
      console.error("Add task failed", err);
      alert("Thêm công việc thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      await handleAdd();
    }
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <input
        type="text"
        placeholder="Nhập tên công việc"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: 6,
          border: "1px solid rgba(16,24,40,0.08)",
          fontSize: 14,
          outline: "none",
          background: "#fff",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
        aria-label="Tên công việc"
      />
      <button
        onClick={handleAdd}
        disabled={isLoading}
        style={{
          background: isLoading ? "#93c5fd" : "#2563eb",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 8,
          minWidth: 180,
          fontWeight: 600,
          cursor: isLoading ? "not-allowed" : "pointer",
          boxShadow: "0 6px 12px rgba(37,99,235,0.18)",
        }}
      >
        {isLoading ? "Đang thêm..." : "Thêm công việc"}
      </button>
    </div>
  );
}