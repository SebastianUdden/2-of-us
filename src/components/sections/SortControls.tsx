import { useEffect, useRef } from "react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSortMinimized && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedButton = container.querySelector(
        `[data-sort-field="${sortField}"]`
      );

      if (selectedButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = (selectedButton as HTMLElement).offsetLeft;
        const buttonWidth = (selectedButton as HTMLElement).offsetWidth;

        // Calculate the scroll position to center the button
        const scrollLeft = buttonLeft - (containerWidth - buttonWidth) / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [sortField, isSortMinimized]);

  return (
    <div className="border-t border-gray-800 max-w-screen-lg mx-auto">
      <div
        className={`flex items-center justify-between ${
          isSortMinimized ? "py-1" : "p-4 sm:px-4"
        } transition-all duration-200`}
      >
        <div
          className={`flex-1 transition-all duration-200 ${
            isSortMinimized ? "h-6 overflow-hidden opacity-0" : ""
          }`}
        >
          <div className="flex items-center gap-2 w-full justify-between">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto flex-1 scroll-smooth"
            >
              <div className="flex items-center gap-2 min-w-max">
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
          </div>
        </div>
        <button
          onClick={onMinimizeToggle}
          className="ml-4 p-1 text-gray-400 hover:text-gray-300 transition-colors shrink-0"
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
