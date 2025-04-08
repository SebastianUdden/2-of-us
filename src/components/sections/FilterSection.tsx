import { LabelFilter, LabelState } from "../../types/LabelState";

import { LabelPill } from "../../components/LabelPill";
import { List } from "../../types/List";
import { MinimizeIcon } from "../icons/MinimizeIcon";
import { Task } from "../../types/Task";

interface FilterSectionProps {
  tab: string;
  isCategoriesExpanded: boolean;
  setIsCategoriesExpanded: (expanded: boolean) => void;
  isAllExpanded: boolean;
  setIsAllExpanded: (expanded: boolean) => void;
  setIsAllExpandedMode: (mode: boolean) => void;
  setExpandedTaskId: (id: string | null) => void;
  setExpandedListId: (id: string | null) => void;
  tasks: Task[];
  lists: List[];
  completedCount: number;
  tasksWithDueDate: number;
  labels: Set<string>;
  counts: Record<string, number>;
  labelFilters: LabelFilter[];
  handleCompletedClick: () => void;
  handleDueDateClick: () => void;
  handleLabelClick: (label: string) => void;
  clearAllFilters: () => void;
  getCompletedState: () => LabelState;
  getDueDateState: () => LabelState;
  getLabelState: (label: string) => LabelState;
  getSizeSmallState: () => LabelState;
  getSizeMediumState: () => LabelState;
  getSizeLargeState: () => LabelState;
  handleSizeSmallClick: () => void;
  handleSizeMediumClick: () => void;
  handleSizeLargeClick: () => void;
  tasksWithSizeSmall: number;
  tasksWithSizeMedium: number;
  tasksWithSizeLarge: number;
}

/**
 * Component for managing filter categories and filter pills
 */
export const FilterSection = ({
  tab,
  isCategoriesExpanded,
  setIsCategoriesExpanded,
  isAllExpanded,
  setIsAllExpanded,
  setIsAllExpandedMode,
  setExpandedTaskId,
  setExpandedListId,
  tasks,
  lists,
  completedCount,
  tasksWithDueDate,
  tasksWithSizeSmall,
  tasksWithSizeMedium,
  tasksWithSizeLarge,
  handleSizeSmallClick,
  handleSizeMediumClick,
  handleSizeLargeClick,
  labels,
  counts,
  labelFilters,
  handleCompletedClick,
  handleDueDateClick,
  handleLabelClick,
  clearAllFilters,
  getCompletedState,
  getDueDateState,
  getLabelState,
  getSizeSmallState,
  getSizeMediumState,
  getSizeLargeState,
}: FilterSectionProps) => {
  const filteredTasks =
    tab === "tasks"
      ? tasks.filter((task) => !task.parentTaskId && !task.archived)
      : tasks;
  const filteredArchivedTasks = tasks.filter(
    (task) => !task.parentTaskId && task.archived
  );

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <div className="flex flex-row w-full justify-between">
        <button
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mb-2"
        >
          <span className="text-xs sm:text-sm">Filterkategorier</span>
          <MinimizeIcon
            isMinimized={!isCategoriesExpanded}
            className="w-4 h-4"
          />
        </button>
        <button
          onClick={() => {
            setIsAllExpandedMode(!isAllExpanded);
            setIsAllExpanded(!isAllExpanded);
            if (isAllExpanded) {
              setExpandedTaskId(null);
              setExpandedListId(null);
            } else {
              // Expand all tasks and lists
              const allTaskIds = tasks.map((task) => task.id);
              const allListIds = lists.map((list) => list.id);
              setExpandedTaskId(allTaskIds[0] || null);
              setExpandedListId(allListIds[0] || null);
            }
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mb-2 ml-4"
        >
          <span className="text-xs sm:text-sm whitespace-nowrap">
            {isAllExpanded ? "Minimera alla" : "Expandera alla"}
          </span>
          <MinimizeIcon isMinimized={isAllExpanded} className="w-4 h-4" />
        </button>
      </div>
      <div
        className={`flex flex-wrap gap-2 transition-all duration-200 ${
          isCategoriesExpanded
            ? "opacity-100 max-h-[500px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {completedCount > 0 && (
          <LabelPill
            label="Avklarade"
            onClick={handleCompletedClick}
            state={getCompletedState()}
            count={completedCount}
          />
        )}
        {tasksWithDueDate > 0 && (
          <LabelPill
            label="Förfallodatum"
            onClick={handleDueDateClick}
            state={getDueDateState()}
            count={tasksWithDueDate}
          />
        )}
        {tasksWithSizeSmall > 0 && (
          <LabelPill
            label="Storlek (S)"
            onClick={handleSizeSmallClick}
            state={getSizeSmallState()}
            count={tasksWithSizeSmall}
          />
        )}
        {tasksWithSizeMedium > 0 && (
          <LabelPill
            label="Storlek (M)"
            onClick={handleSizeMediumClick}
            state={getSizeMediumState()}
            count={tasksWithSizeMedium}
          />
        )}
        {tasksWithSizeLarge > 0 && (
          <LabelPill
            label="Storlek (L)"
            onClick={handleSizeLargeClick}
            state={getSizeLargeState()}
            count={tasksWithSizeLarge}
          />
        )}
        {Array.from(labels)
          .filter((label) => counts[label] > 0)
          .map((label) => (
            <LabelPill
              key={label}
              label={label}
              onClick={() => handleLabelClick(label)}
              state={getLabelState(label)}
              count={counts[label]}
            />
          ))}
        <LabelPill
          label="Rensa filter"
          onClick={clearAllFilters}
          state={
            labelFilters.length === 0
              ? LabelState.SHOW_ONLY
              : LabelState.SHOW_ALL
          }
          count={
            tab === "tasks"
              ? filteredTasks.length
              : filteredArchivedTasks.length
          }
        />
      </div>
    </div>
  );
};
