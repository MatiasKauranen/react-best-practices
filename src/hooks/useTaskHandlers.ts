import { useEffect, useCallback, useMemo, useReducer } from "react";

const API_URL = "http://localhost:5000/tasks";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

interface State {
  task: string;
  tasks: Task[];
  editingIndex: number | null;
  editedTask: string;
}

type Action =
  | { type: "SET_TASK"; payload: string }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "TOGGLE_TASK_DONE"; payload: number }
  | { type: "START_EDITING"; payload: { index: number; text: string } }
  | { type: "SET_EDITED_TASK"; payload: string }
  | { type: "SAVE_EDIT"; payload: Task }
  | { type: "CANCEL_EDIT" };

const taskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TASK":
      return { ...state, task: action.payload };
    case "SET_TASKS":
      return { ...state, tasks: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], task: "" };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "TOGGLE_TASK_DONE":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, done: !task.done } : task
        ),
      };
    case "START_EDITING":
      return {
        ...state,
        editingIndex: action.payload.index,
        editedTask: action.payload.text,
      };
    case "SET_EDITED_TASK":
      return { ...state, editedTask: action.payload };
    case "SAVE_EDIT":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        editingIndex: null,
      };
    case "CANCEL_EDIT":
      return { ...state, editingIndex: null };
    default:
      return state;
  }
};

function useTaskHandlers() {
  const [state, dispatch] = useReducer(taskReducer, {
    task: "",
    tasks: [],
    editingIndex: null,
    editedTask: "",
  });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "SET_TASKS", payload: data }))
      .catch((error) => console.error("Failed to fetch tasks:", error));
  }, []);

  const addTask = useCallback(
    async (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      if ("key" in event && event.key !== "Enter") return;
      if (!state.task.trim()) return;

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: state.task }),
        });
        const newTask = await res.json();
        dispatch({ type: "ADD_TASK", payload: newTask });
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [state.task]
  );

  const deleteTask = async (index: number) => {
    try {
      const taskId = state.tasks[index].id;
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      dispatch({ type: "DELETE_TASK", payload: taskId });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskDone = async (index: number) => {
    const updatedTask = {
      ...state.tasks[index],
      done: !state.tasks[index].done,
    };

    try {
      const response = await fetch(`${API_URL}/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      dispatch({ type: "TOGGLE_TASK_DONE", payload: updatedTask.id });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditing = (index: number) => {
    dispatch({
      type: "START_EDITING",
      payload: { index, text: state.tasks[index].text },
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EDITED_TASK", payload: e.target.value });
  };

  const saveEdit = async () => {
    if (state.editingIndex === null) return;

    const updatedTask = {
      ...state.tasks[state.editingIndex],
      text: state.editedTask,
    };

    try {
      const response = await fetch(`${API_URL}/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      dispatch({ type: "SAVE_EDIT", payload: updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const completedTaskCount = useMemo(
    () => state.tasks.filter((task) => task.done).length,
    [state.tasks]
  );

  return {
    task: state.task,
    setTask: (value: string) => dispatch({ type: "SET_TASK", payload: value }),
    tasks: state.tasks,
    editingIndex: state.editingIndex,
    editedTask: state.editedTask,
    addTask,
    deleteTask,
    toggleTaskDone,
    startEditing,
    handleEditChange,
    saveEdit,
    completedTaskCount,
    cancelEdit: () => dispatch({ type: "CANCEL_EDIT" }),
  };
}

export default useTaskHandlers;
