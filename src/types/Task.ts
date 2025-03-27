export interface TaskUpdate {
  updatedAt: Date;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
  archived: boolean;
  author: string;
  createdAt: Date;
  updates: TaskUpdate[];
  labels: string[];
  dueDate?: Date;
  isOverdue?: boolean;
}
