import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

interface Task {
  id: number;
  text: string;
  done: boolean;
}

let tasks: Task[] = [];

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to the TaskMaster API!");
});

app.get("/tasks", (req: Request, res: Response): void => {
  res.json(tasks);
});

app.post("/tasks", (req: Request, res: Response): void => {
  const newTask: Task = { id: Date.now(), text: req.body.text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "Task deleted" });
});

app.put("/tasks/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const updatedTaskData = req.body;

  let taskFound = false;
  tasks = tasks.map((task) => {
    if (task.id === id) {
      taskFound = true;
      return { ...task, ...updatedTaskData };
    }
    return task;
  });

  if (!taskFound) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(200).json(updatedTaskData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
