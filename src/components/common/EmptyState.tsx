interface EmptyStateProps {
  type: "tasks" | "lists";
  selectedLabel?: string;
}

/**
 * Component for displaying empty state messages when no tasks or lists are found
 */
export const EmptyState = ({ type, selectedLabel }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <p className="text-lg font-medium mb-2">No {type} found</p>
    <p className="text-sm text-center">
      {selectedLabel
        ? `No ${type} with this label`
        : `Add your first ${type.slice(0, -1)} to get started`}
    </p>
  </div>
);
