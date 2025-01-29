import "../App.css";
import useTaskHandlers from "../hooks/useTaskHandlers";
import { ErrorBoundary } from "react-error-boundary";
import { lazy, Suspense, useState, useEffect } from "react";
import Clock from "./Clock";
import AddButton from "./AddButton";

const TaskItem = lazy(() => import("./TaskItem"));

function MainPage() {
  const {
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
    cancelEdit,
  } = useTaskHandlers();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Clock />
      <h1>Taskmaster 1.0</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={addTask}
        style={{
          padding: "0.3rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
        }}
        autoFocus
        placeholder="Enter Task"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <AddButton onClick={addTask} />
        {tasks.length > 0 && <p>Total: {tasks.length}</p>}
        {tasks.length > 0 && <p>Completed: {completedTaskCount}</p>}
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
                cancelEdit,
              }}
            />
          ))
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={
        <div>
          <p>Something went wrong</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      }
    >
      <MainPage />
    </ErrorBoundary>
  );
}
