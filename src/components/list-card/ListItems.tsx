import { ListItem } from "../../types/List";

interface ListItemsProps {
  type: "ordered" | "unordered";
  items: ListItem[];
  completedCount: number;
  totalCount: number;
  onItemComplete: (itemId: string) => void;
  onItemContentChange: (itemId: string, value: string) => void;
  onItemDelete: (itemId: string) => void;
  onAddItem: () => void;
}

const ListItems = ({
  type,
  items,
  completedCount,
  totalCount,
  onItemComplete,
  onItemContentChange,
  onItemDelete,
  onAddItem,
}: ListItemsProps) => {
  const ListComponent = type === "ordered" ? "ol" : "ul";
  const listClassName = type === "ordered" ? "list-decimal" : "list-disc";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">
          Items ({completedCount}/{totalCount})
        </h3>
        <button
          onClick={onAddItem}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          + Add Item
        </button>
      </div>
      <ListComponent className={`${listClassName} list-inside space-y-2`}>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => onItemComplete(item.id)}
              className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <input
              type="text"
              value={item.content}
              onChange={(e) => onItemContentChange(item.id, e.target.value)}
              className={`flex-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 ${
                item.completed ? "line-through text-gray-400" : ""
              }`}
              placeholder={`Item ${index + 1}`}
            />
            <button
              onClick={() => onItemDelete(item.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </li>
        ))}
      </ListComponent>
    </div>
  );
};

export default ListItems;
