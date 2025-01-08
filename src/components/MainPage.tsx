import React, { useState, useCallback, useMemo } from "react";
import "../App.css";
import {
  EditIcon,
  TrashIcon,
  CheckIcon,
  CheckboxIcon,
  PlusIcon,
  iconStyle,
} from "./Ui";
import useLocalStorage from "../hooks/useLocalStorage";
import { ErrorBoundary } from "react-error-boundary";

interface TaskItemProps {
  taskItem: {
    text: string;
    done: boolean;
    editedTask: string;
  };
  index: number;
  editingIndex: number | null;
  handlers: {
    toggleTaskDone: (index: number) => void;
    startEditing: (index: number) => void;
    deleteTask: (index: number) => void;
    saveEdit: () => void;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    cancelEdit: () => void;
  };
}

<ErrorBoundary
  fallback={
    <div>
      <p>Something went wrong</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  }
>
  <MainPage />
</ErrorBoundary>;

const TaskItem = React.memo(
  ({ taskItem, index, editingIndex, handlers }: TaskItemProps) => {
    const {
      toggleTaskDone,
      startEditing,
      deleteTask,
      saveEdit,
      handleEditChange,
    } = handlers;

    const taskContainer = {
      display: "flex",
      alignItems: "center",
      border: "0.1rem solid grey",
      padding: "0.5rem 0.5rem",
      borderRadius: "0.5rem",
      marginBottom: "0.5rem",
      justifyContent: "space-between",
    };

    return (
      <div key={index} style={taskContainer}>
        {editingIndex === index ? (
          <input
            type="text"
            value={taskItem.editedTask}
            onChange={handleEditChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              else if (e.key === "Escape") handlers.cancelEdit();
            }}
            style={{ padding: "0.2rem 0.6rem", borderRadius: "0.2rem" }}
            autoFocus
          />
        ) : (
          <span
            style={{
              textDecoration: taskItem.done ? "line-through" : "none",
            }}
          >
            {taskItem.text}
          </span>
        )}
        <div>
          {editingIndex !== index ? (
            <>
              <button onClick={() => toggleTaskDone(index)} style={iconStyle}>
                <CheckboxIcon />
              </button>
              <button onClick={() => startEditing(index)} style={iconStyle}>
                <EditIcon />
              </button>
              <button onClick={() => deleteTask(index)} style={iconStyle}>
                <TrashIcon />
              </button>
            </>
          ) : (
            <button onClick={saveEdit} style={iconStyle}>
              <CheckIcon />
            </button>
          )}
        </div>
      </div>
    );
  }
);

function MainPage() {
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

  return (
    <>
      <h1>Todo-List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={addTask}
        style={{
          padding: "0.2rem 0.6rem",
          borderRadius: "0.2rem",
          marginBottom: "2rem",
        }}
        autoFocus
        placeholder="Write a task..."
      />
      <button style={iconStyle} onClick={addTask}>
        <PlusIcon />
      </button>
      <p>Completed Tasks: {completedTaskCount}</p>
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        tasks.map((taskItem, index) => (
          <TaskItem
            key={index}
            taskItem={{ ...taskItem, editedTask }}
            index={index}
            editingIndex={editingIndex}
            handlers={{
              toggleTaskDone,
              startEditing,
              deleteTask,
              saveEdit,
              handleEditChange,
              cancelEdit: () => setEditingIndex(null),
            }}
          />
        ))
      )}
    </>
  );
}

export default MainPage;
