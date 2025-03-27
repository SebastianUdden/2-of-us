export type ListItem = {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ListType = "ordered" | "unordered";

export type List = {
  id: string;
  title: string;
  description?: string;
  type: ListType;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  labels?: string[];
};
