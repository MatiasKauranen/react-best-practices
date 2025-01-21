export interface TaskItemProps {
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
