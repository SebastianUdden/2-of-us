import { EmptyState } from "../common/EmptyState";
import { List } from "../../types/List";
import ListCard from "../list-card/ListCard";

interface ListSectionProps {
  lists: List[];
  selectedLabel: string | null;
  onComplete: (listId: string) => void;
  onDelete: (listId: string) => void;
  onUpdate: (updatedList: List) => void;
  onLabelClick: (label: string) => void;
  onCloneToTask: (list: List) => void;
  onPriorityChange: (listId: string, newPosition: number) => void;
  isCollapsed: boolean;
  onHeightChange: (height: number | null) => void;
  expandedListId: string | "all" | null;
  setExpandedListId: (id: string | null) => void;
  showPriorityControls: boolean;
  animatingListId: string | null;
  animatingListHeight: number | null;
  onTabChange?: (tab: "todos" | "archive" | "lists") => void;
}

export const ListSection = ({
  lists,
  selectedLabel,
  onComplete,
  onDelete,
  onUpdate,
  onLabelClick,
  onCloneToTask,
  onPriorityChange,
  isCollapsed,
  onHeightChange,
  expandedListId,
  setExpandedListId,
  showPriorityControls,
  animatingListId,
  animatingListHeight,
  onTabChange,
}: ListSectionProps) => {
  return (
    <>
      {lists.length === 0 ? (
        <EmptyState type="lists" selectedLabel={selectedLabel || undefined} />
      ) : (
        lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
            onComplete={onComplete}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onLabelClick={onLabelClick}
            selectedLabel={selectedLabel || ""}
            onCloneToTask={onCloneToTask}
            onPriorityChange={onPriorityChange}
            totalLists={lists.length}
            isAnimating={animatingListId === list.id}
            isCollapsed={isCollapsed}
            onHeightChange={onHeightChange}
            showPriorityControls={showPriorityControls}
            expandedListId={expandedListId === "all" ? list.id : expandedListId}
            setExpandedListId={setExpandedListId}
            onTabChange={onTabChange}
          />
        ))
      )}
      {animatingListHeight !== null && isCollapsed && (
        <div
          className="w-full bg-transparent"
          style={{ height: `${animatingListHeight}px` }}
        />
      )}
    </>
  );
};
