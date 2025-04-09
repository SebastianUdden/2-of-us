import { SubTask } from "./SubTask";

export interface TaskUpdate {
  updatedAt: Date;
  username?: string;
  initials?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
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
  username?: string;
  initials?: string;
  assignee?: string;
}
