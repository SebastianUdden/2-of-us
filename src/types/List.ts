export interface ListItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  title: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  type: "ordered" | "unordered";
  items: ListItem[];
  labels?: string[];
  priority: number;
}
