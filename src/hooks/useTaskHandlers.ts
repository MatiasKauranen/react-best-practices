import { useState, useEffect, useCallback, useMemo } from "react";

const API_URL = "http://localhost:5000/tasks";

function useTaskHandlers() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<
    { id: number; text: string; done: boolean }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setTasks)
      .catch((error) => console.error("Failed to fetch tasks:", error));
  }, []);

  const addTask = useCallback(
    async (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      if ("key" in event && event.key !== "Enter") return;
      if (!task.trim()) return;

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: task }),
        });
        const newTask = await res.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [task]
  );

  const deleteTask = async (index: number) => {
    try {
      const taskId = tasks[index].id;
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskDone = async (index: number) => {
    const updatedTask = { ...tasks[index], done: !tasks[index].done };

    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${tasks[index].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task, i) => (i === index ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(e.target.value);
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;
    const updatedTask = { ...tasks[editingIndex], text: editedTask };

    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${tasks[editingIndex].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task, i) => (i === editingIndex ? updatedTask : task))
      );

      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const completedTaskCount = useMemo(() => {
    return tasks.filter((task) => task.done).length;
  }, [tasks]);

  return {
    task,
    setTask,
    tasks,
    editingIndex,
    editedTask,
    addTask,
    deleteTask,
    toggleTaskDone,
    startEditing,
    handleEditChange,
    saveEdit,
    completedTaskCount,
    cancelEdit: () => setEditingIndex(null),
  };
}

export default useTaskHandlers;
