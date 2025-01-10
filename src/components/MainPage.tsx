import "../App.css";
import { PlusIcon, iconStyle } from "./Ui";
import TaskItem from "./TaskItem";
import useTaskHandlers from "../hooks/useTaskHandlers";
import { ErrorBoundary } from "react-error-boundary";

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
    </div>
  );
}
export default MainPage;
