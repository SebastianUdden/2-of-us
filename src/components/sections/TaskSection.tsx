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
  onHeightChange: (height: number | null) => void;
  onLabelClick: (label: string) => void;
  onAddSubtask: (taskId: string) => void;
  showPriorityControls: boolean;
  currentSortField: string;
  animatingTaskId: string | null;
  animatingTaskHeight: number | null;
  onAddTask: () => void;
  expandedTaskId: string | "all" | null;
  setExpandedTaskId: (id: string | null) => void;
  showSubTasksId: string | null;
  setShowSubTasksId: (id: string | null) => void;
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
  animatingTaskId,
  animatingTaskHeight,
  onHeightChange,
  onAddTask,
  expandedTaskId,
  setExpandedTaskId,
  showSubTasksId,
  setShowSubTasksId,
}: TaskSectionProps) => {
  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState
          type="tasks"
          selectedLabel={selectedLabel || undefined}
          onAddTask={onAddTask}
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
            isAnimating={task.id === animatingTaskId}
            isCollapsed={isCollapsed}
            onLabelClick={onLabelClick}
            selectedLabel={selectedLabel || ""}
            onAddSubtask={onAddSubtask}
            expandAll={expandedTaskId === "all"}
            showPriorityControls={showPriorityControls}
            currentSortField={currentSortField}
            animatingTaskId={animatingTaskId}
            animatingTaskHeight={animatingTaskHeight}
            onHeightChange={onHeightChange}
            expandedTaskId={expandedTaskId === "all" ? task.id : expandedTaskId}
            setExpandedTaskId={setExpandedTaskId}
            showSubTasksId={showSubTasksId}
            setShowSubTasksId={setShowSubTasksId}
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
