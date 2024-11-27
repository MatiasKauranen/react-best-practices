import "./App.css";
import EditIcon from "./UI/Icons/EditIcon";
import TrashIcon from "./UI/Icons/TrashIcon";
import CheckIcon from "./UI/Icons/CheckIcon";
import CheckboxIcon from "./UI/Icons/CheckboxIcon";
import PlusIcon from "./UI/Icons/PlusIcon";
import iconStyle from "./UI/Icons/style";
import { useState } from "react";

function MainPage() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);
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
      setTasks([...tasks, { text: task, done: false }]);
      setTask("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
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

  const borderStyle = {
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
          <div key={index} style={borderStyle}>
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
