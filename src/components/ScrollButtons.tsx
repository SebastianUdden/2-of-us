import { DownArrowWithLine, UpArrowWithLine } from "./icons/TaskIcons";

interface ScrollButtonsProps {
  onScrollToTop: () => void;
  onScrollToBottom: () => void;
}

export const ScrollButtons = ({
  onScrollToTop,
  onScrollToBottom,
}: ScrollButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onScrollToTop}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll to top"
      >
        <UpArrowWithLine className="w-5 h-5 text-blue-500" />
      </button>
      <button
        onClick={onScrollToBottom}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Scroll to bottom"
      >
        <DownArrowWithLine className="w-5 h-5 text-blue-500" />
      </button>
    </div>
  );
};
