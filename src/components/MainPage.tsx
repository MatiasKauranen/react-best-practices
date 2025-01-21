import "../App.css";
import useTaskHandlers from "../hooks/useTaskHandlers";
import { ErrorBoundary } from "react-error-boundary";
import { lazy, Suspense } from "react";
import { iconStyle } from "./Ui";
import Clock from "./Clock";

const TaskItem = lazy(() => import("./TaskItem"));

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
        <button style={iconStyle} onClick={addTask}>
          Add
        </button>
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
export default MainPage;
