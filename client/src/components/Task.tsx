import React from "react";

export default function Task() {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        margin: "12px 0 20px",
        background: "#fff",
        padding: 14,
        borderRadius: 8,
        border: "1px solid rgba(16,24,40,0.04)",
        alignItems: "center",
      }}
    >
      <button
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          fontWeight: 600,
          border: "none",
        }}
      >
        Tất cả
      </button>
      <button
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: "#fff",
          border: "1px solid rgba(16,24,40,0.06)",
          fontWeight: 600,
        }}
      >
        Hoàn thành
      </button>
      <button
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: "#fff",
          border: "1px solid rgba(16,24,40,0.06)",
          fontWeight: 600,
        }}
      >
        Đang thực hiện
      </button>
    </div>
  );
}
