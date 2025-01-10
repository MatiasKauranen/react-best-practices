import { useState, useEffect } from "react";

function useLocalStorage() {
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks");
    }
  }, [tasks]);

  return [tasks, setTasks] as const;
}

export default useLocalStorage;
