import { EmptyState } from "../common/EmptyState";
import { Task } from "../../types/Task";
import TaskCard from "../task-card/TaskCard";

interface TaskSectionProps {
  tasks: Task[];
  selectedLabel: string | null;
  onPriorityChange: (taskId: string, newPosition: number) => void;
  onComplete: (taskId: string, allCompleted?: boolean) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
  isCollapsed: boolean;
  onLabelClick: (label: string) => void;
  onAddSubtask: (taskId: string, taskTitle: string) => void;
  showPriorityControls: boolean;
  currentSortField: string;
  onAddTask: () => void;
  expandedTaskId: string | "all" | null;
  setExpandedTaskId: (id: string | null) => void;
  showSubTasksId: string | null;
  setShowSubTasksId: (id: string | null) => void;
  onClearFilters?: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setFocusDescription: (focus: boolean) => void;
}

export const TaskSection = ({
  tasks,
  selectedLabel,
  onPriorityChange,
  onComplete,
  onDelete,
  onArchive,
  onUpdate,
  isCollapsed,
  onLabelClick,
  onAddSubtask,
  showPriorityControls,
  currentSortField,
  onAddTask,
  expandedTaskId,
  setExpandedTaskId,
  showSubTasksId,
  setShowSubTasksId,
  onClearFilters,
  setIsEditing,
  setFocusDescription,
}: TaskSectionProps) => {
  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState
          type="tasks"
          selectedLabel={selectedLabel || undefined}
          onAddTask={onAddTask}
          onClearFilters={onClearFilters}
        />
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPriorityChange={onPriorityChange}
            onComplete={onComplete}
            onDelete={onDelete}
            onArchive={onArchive}
            onUpdate={onUpdate}
            totalTasks={tasks.length}
            isCollapsed={isCollapsed}
            onLabelClick={onLabelClick}
            selectedLabel={selectedLabel || ""}
            onAddSubtask={onAddSubtask}
            expandAll={expandedTaskId === "all"}
            showPriorityControls={
              showPriorityControls && expandedTaskId === task.id
            }
            currentSortField={currentSortField}
            expandedTaskId={expandedTaskId === "all" ? task.id : expandedTaskId}
            setExpandedTaskId={setExpandedTaskId}
            showSubTasksId={showSubTasksId}
            setShowSubTasksId={setShowSubTasksId}
            setIsEditing={setIsEditing}
            setFocusDescription={setFocusDescription}
          />
        ))
      )}
    </>
  );
};
