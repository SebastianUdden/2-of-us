import { SubTask } from "./SubTask";

export interface TaskUpdate {
  updatedAt: Date;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  labels?: string[];
  archived: boolean;
  updates: TaskUpdate[];
  subtasks: SubTask[];
  parentTaskId?: string;
  size?: string;
}
