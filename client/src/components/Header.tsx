// Header.tsx
import React from "react";
import InputSearch from "./InputSearch";
import Task from "./Task";
import TaskList from "./TaskList";
import DeleteTask from "./DeleteTask";
import Loading from "./Loading";
import { useLoading } from "./LoadingProvider";

export default function Header() {
  const { isLoading } = useLoading();

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "28px auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        color: "#17212b",
        background: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(16,24,40,0.06)",
        padding: 28,
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        position: "relative",
      }}
    >
      {isLoading && <Loading />}

      <header
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 18,
          color: "#0f1724",
        }}
      >
        Quản lý công việc
      </header>

      <div
        style={{
          background: "linear-gradient(180deg, #ffffff, #fbfbfb)",
          borderRadius: 8,
          padding: 18,
          boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
          marginBottom: 18,
          border: "1px solid rgba(16,24,40,0.04)",
        }}
      >
        <InputSearch />
      </div>

      <Task />
      <TaskList />
      <DeleteTask />
    </div>
  );
}