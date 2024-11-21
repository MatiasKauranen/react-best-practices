import "./App.css";
import { useState } from "react";
import EditIcon from "./UI/Icons/EditIcon";
import TrashIcon from "./UI/Icons/TrashIcon";
import CheckIcon from "./UI/Icons/CheckIcon";
import iconStyle from "./UI/Icons/style";

function App() {
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");

  const addTask = () => {
    setShowInput(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
      setShowInput(false);
    } else if (e.key === "Escape") {
      setShowInput(false);
    }
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedTask(tasks[index]);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(e.target.value);
  };

  const saveEdit = () => {
    if (editedTask.trim()) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex!] = editedTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditedTask("");
    }
  };

  const boxStyle = {
    display: "flex",
    alignItems: "center",
    border: "0.1rem solid grey",
    padding: "0.5rem 0.5rem",
    borderRadius: "0.5rem",
    marginBottom: "0.5rem",
    justifyContent: "space-between",
    width: "100%",
  };

  return (
    <>
      <h1>Todo-List</h1>
      {!showInput && <button onClick={addTask}>Add Task</button>}
      {showInput && (
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          style={{
            marginBottom: "1rem",
            padding: "0.2rem 0.6rem",
          }}
          autoFocus
          placeholder="Type here..."
        />
      )}
      <h2>Your Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        tasks.map((task, index) => (
          <div key={index} style={boxStyle}>
            {editingIndex === index ? (
              <input
                type="text"
                value={editedTask}
                onChange={handleEditChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  else if (e.key === "Escape") setEditingIndex(null);
                }}
                style={{ padding: "0.2rem 0.6rem" }}
                autoFocus
              />
            ) : (
              task
            )}
            <div>
              {editingIndex !== index && (
                <>
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

export default App;
