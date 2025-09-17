import React from "react";

export default function DeleteTask() {
  return (
    <div style={{ display: "flex", gap: 18, marginTop: 8, flexWrap: "wrap" }}>
      <button
        style={{
          background: "#ff5c5c",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
          minWidth: 210,
        }}
      >
        Xóa công việc hoàn thành
      </button>
      <button
        style={{
          background: "transparent",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.12)",
          padding: "10px 18px",
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
          minWidth: 210,
        }}
      >
        Xóa tất cả công việc
      </button>
    </div>
  );
}
