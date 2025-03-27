import { List, ListItem } from "../../types/List";

import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";
import { formatDistanceToNow } from "date-fns";

interface ListCardProps {
  list: List;
  onComplete: (listId: string, itemId: string) => void;
  onDelete: (listId: string) => void;
  onUpdate: (updatedList: List) => void;
  onLabelClick: (label: string) => void;
  selectedLabel?: string;
}

const ListCard = ({
  list,
  onComplete,
  onDelete,
  onUpdate,
  onLabelClick,
  selectedLabel,
}: ListCardProps) => {
  const handleItemComplete = (itemId: string) => {
    onComplete(list.id, itemId);
  };

  const handleDelete = () => {
    onDelete(list.id);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...list, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({ ...list, description: e.target.value });
  };

  const handleItemContentChange = (
    itemId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, content: e.target.value } : item
    );
    onUpdate({ ...list, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: ListItem = {
      id: `${list.id}-${list.items.length + 1}`,
      content: "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onUpdate({ ...list, items: [...list.items, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = list.items.filter((item) => item.id !== itemId);
    onUpdate({ ...list, items: updatedItems });
  };

  const completedCount = list.items.filter((item) => item.completed).length;
  const totalCount = list.items.length;

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={list.title}
            onChange={handleTitleChange}
            className="w-full bg-transparent text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            placeholder="List title"
          />
          <textarea
            value={list.description || ""}
            onChange={handleDescriptionChange}
            className="w-full bg-transparent text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            placeholder="Add description..."
            rows={2}
          />
        </div>
        <div className="flex items-center space-x-2">
          {list.labels?.map((label) => (
            <LabelPill
              key={label}
              label={label}
              onClick={() => onLabelClick(label)}
              state={
                selectedLabel === label
                  ? LabelState.SHOW_ONLY
                  : LabelState.SHOW_ALL
              }
            />
          ))}
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {list.type === "ordered" ? (
          <ol className="list-decimal list-inside space-y-2">
            {list.items.map((item, index) => (
              <li key={item.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleItemComplete(item.id)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => handleItemContentChange(item.id, e)}
                  className={`flex-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 ${
                    item.completed ? "line-through text-gray-400" : ""
                  }`}
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {list.items.map((item, index) => (
              <li key={item.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleItemComplete(item.id)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => handleItemContentChange(item.id, e)}
                  className={`flex-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 ${
                    item.completed ? "line-through text-gray-400" : ""
                  }`}
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleAddItem}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          + Add item
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div>
          {completedCount}/{totalCount} items completed
        </div>
        <div>
          Created {formatDistanceToNow(list.createdAt, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ListCard;
