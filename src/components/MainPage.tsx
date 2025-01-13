import "../App.css";
import { PlusIcon, iconStyle } from "./Ui";
import useTaskHandlers from "../hooks/useTaskHandlers";
import { ErrorBoundary } from "react-error-boundary";
import { lazy, Suspense } from "react";

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
      <Suspense fallback={<div>Loading...</div>}>
        <button style={iconStyle} onClick={addTask}>
          <PlusIcon />
        </button>
        <h3>Completed Tasks: {completedTaskCount}</h3>
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
