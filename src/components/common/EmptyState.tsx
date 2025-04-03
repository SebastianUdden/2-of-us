interface EmptyStateProps {
  type: "tasks" | "lists";
  selectedLabel?: string;
  onAddTask: () => void;
}

/**
 * Component for displaying empty state messages when no tasks or lists are found
 */
export const EmptyState = ({
  type,
  selectedLabel,
  onAddTask,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <p className="text-lg font-medium mb-2">No {type} found</p>
    <p className="text-sm text-center">
      {selectedLabel ? (
        `No ${type} with this label`
      ) : (
        <>
          <button className="underline" onClick={() => onAddTask()}>
            {`Add your first ${type.slice(0, -1)}`}
          </button>{" "}
          to get started
        </>
      )}
    </p>
  </div>
);
