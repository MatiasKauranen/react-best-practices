import "./App.css";
import { useState } from "react";

function App() {
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

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

  return (
    <>
      <h1>Todo-List</h1>
      <div>
        <button onClick={addTask}>Add Task</button>
        {showInput && (
          <div>
            <input
              type="text"
              value={task}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              style={{ margin: "1rem", padding: "0.2rem" }}
              autoFocus
            />
          </div>
        )}
      </div>
      <div>
        <h2>Your Tasks:</h2>
        <div>
          {tasks.length === 0 ? (
            <div>No tasks</div>
          ) : (
            tasks.map((task, index) => (
              <li key={index}>
                <span
                  style={{
                    border: "0.2rem solid grey",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  {task}
                </span>
                <button
                  onClick={() => deleteTask(index)}
                  style={{
                    marginLeft: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  ❌
                </button>
              </li>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
