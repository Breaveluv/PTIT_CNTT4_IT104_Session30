import React from "react";
import "./loading.css";

export default function Loading() {
  return (
    <div className="loading-overlay">
      <h1>Loading</h1>
      <div className="circle"></div>
    </div>
  );
}