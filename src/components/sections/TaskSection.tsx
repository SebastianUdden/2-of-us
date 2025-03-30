import { EmptyState } from "../common/EmptyState";
import { Task } from "../../types/Task";
import TaskCard from "../task-card/TaskCard";

interface TaskSectionProps {
  tasks: Task[];
  selectedLabel: string | null;
  onPriorityChange: (taskId: string, newPosition: number) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
  isCollapsed: boolean;
  onHeightChange: (height: number) => void;
  onLabelClick: (label: string) => void;
  onAddSubtask: (taskId: string) => void;
  expandedTaskId: string | "all" | null;
  setExpandedTaskId: (id: string | null) => void;
  showPriorityControls: boolean;
  currentSortField: string;
  animatingTaskId: string | null;
  animatingTaskHeight: number | null;
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
  onHeightChange,
  onLabelClick,
  onAddSubtask,
  expandedTaskId,
  setExpandedTaskId,
  showPriorityControls,
  currentSortField,
  animatingTaskId,
  animatingTaskHeight,
}: TaskSectionProps) => {
  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState type="tasks" selectedLabel={selectedLabel || undefined} />
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
            isAnimating={task.id === animatingTaskId}
            isCollapsed={isCollapsed}
            onHeightChange={onHeightChange}
            onLabelClick={onLabelClick}
            selectedLabel={selectedLabel || ""}
            onAddSubtask={onAddSubtask}
            expandedTaskId={expandedTaskId === "all" ? task.id : expandedTaskId}
            setExpandedTaskId={setExpandedTaskId}
            showPriorityControls={showPriorityControls}
            currentSortField={currentSortField}
          />
        ))
      )}
      {animatingTaskHeight !== null && isCollapsed && (
        <div
          className="w-full bg-transparent"
          style={{ height: `${animatingTaskHeight}px` }}
        />
      )}
    </>
  );
};
