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
import { useState } from "react";

function MainPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useLocalStorage();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");

  const addTask = (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if ("key" in event && event.key !== "Enter") {
      return;
    }
    if (task.trim()) {
      const newTask = { text: task, done: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const deleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

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

  const toggleTaskDone = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

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
    <>
      <h1>Todo-List</h1>
      <input
        type="text"
        value={task}
        onChange={handleInputChange}
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
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        tasks.map((taskItem, index) => (
          <div key={index} style={taskContainer}>
            {editingIndex === index ? (
              <input
                type="text"
                value={editedTask}
                onChange={handleEditChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  else if (e.key === "Escape") setEditingIndex(null);
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
              {editingIndex !== index && (
                <>
                  <button
                    onClick={() => toggleTaskDone(index)}
                    style={iconStyle}
                  >
                    <CheckboxIcon />
                  </button>
                  <button onClick={() => startEditing(index)} style={iconStyle}>
                    <EditIcon />
                  </button>
                  <button onClick={() => deleteTask(index)} style={iconStyle}>
                    <TrashIcon />
                  </button>
                </>
              )}
              {editingIndex === index && (
                <button onClick={saveEdit} style={iconStyle}>
                  <CheckIcon />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default MainPage;
