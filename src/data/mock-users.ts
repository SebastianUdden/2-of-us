export const AVAILABLE_ASSIGNEES = ["SU", "SC"] as const;

export type Assignee = (typeof AVAILABLE_ASSIGNEES)[number];
