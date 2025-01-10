import { useState, useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

function useTaskHandlers() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useLocalStorage();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");

  const addTask = useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      if ("key" in event && event.key !== "Enter") return;

      if (task.trim()) {
        const newTask = { text: task, done: false };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        setTask("");
      }
    },
    [task, tasks, setTasks]
  );

  const deleteTask = useCallback(
    (index: number) => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    },
    [tasks, setTasks]
  );

  const toggleTaskDone = useCallback(
    (index: number) => {
      const updatedTasks = [...tasks];
      updatedTasks[index].done = !updatedTasks[index].done;
      setTasks(updatedTasks);
    },
    [tasks, setTasks]
  );

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(e.target.value);
  };

  const saveEdit = () => {
    if (editedTask.trim()) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex!] = {
        ...updatedTasks[editingIndex!],
        text: editedTask,
      };
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditedTask("");
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
