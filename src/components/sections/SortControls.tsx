import { MinimizeIcon } from "../icons/MinimizeIcon";
import { ScrollButtons } from "../ScrollButtons";
import { SortSection } from "./SortSection";

interface SortControlsProps {
  sortField: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
  sortDirection: "asc" | "desc";
  isSortMinimized: boolean;
  onSortFieldChange: (
    field: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority"
  ) => void;
  onMinimizeToggle: () => void;
  onScrollToTop: () => void;
  onScrollToBottom: () => void;
}

export const SortControls = ({
  sortField,
  sortDirection,
  isSortMinimized,
  onSortFieldChange,
  onMinimizeToggle,
  onScrollToTop,
  onScrollToBottom,
}: SortControlsProps) => {
  return (
    <div className="border-t border-gray-800">
      <div
        className={`flex items-center justify-between ${
          isSortMinimized ? "py-1" : "p-4"
        } transition-all duration-200`}
      >
        <div
          className={`flex-1 transition-all duration-200 max-w-4xl mx-auto ${
            isSortMinimized ? "h-6 overflow-hidden opacity-0" : ""
          }`}
        >
          <div className="flex items-center gap-2 w-full justify-between">
            <SortSection
              sortField={sortField}
              sortDirection={sortDirection}
              onSortFieldChange={onSortFieldChange}
            />
            <ScrollButtons
              onScrollToBottom={onScrollToBottom}
              onScrollToTop={onScrollToTop}
            />
          </div>
        </div>
        <button
          onClick={onMinimizeToggle}
          className="ml-4 p-1 text-gray-400 hover:text-gray-300 transition-colors"
          aria-label={
            isSortMinimized ? "Expand sort options" : "Minimize sort options"
          }
        >
          <MinimizeIcon isMinimized={isSortMinimized} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
