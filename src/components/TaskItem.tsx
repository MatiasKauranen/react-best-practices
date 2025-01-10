import React from "react";
import { CheckboxIcon, EditIcon, TrashIcon, CheckIcon, iconStyle } from "./Ui";
import taskContainer from "./Ui/taskContainer";
import { TaskItemProps } from "../types/TaskItemProps";

const TaskItem: React.FC<TaskItemProps> = ({
  taskItem,
  index,
  editingIndex,
  handlers,
}) => {
  const {
    toggleTaskDone,
    startEditing,
    deleteTask,
    saveEdit,
    handleEditChange,
  } = handlers;

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
};

export default React.memo(TaskItem);
