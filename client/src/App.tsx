// App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { LoadingProvider, useLoading } from "./components/LoadingProvider";

interface Task {
  id: number;
  name: string;
  status: "done" | "todo" | string;
}

// Component con để sử dụng useLoading
function AppContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();

  async function getAllTodos(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Task[]>("http://localhost:8080/todos", {
        timeout: 5000,
      });
      setTasks([...response.data]);
    } catch (error: any) {
      console.error("Error fetching todos:", error.message || error);
      setError("Không thể tải dữ liệu công việc: " + (error.message || "Kết nối thất bại"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <div>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      <Header />
    </div>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}