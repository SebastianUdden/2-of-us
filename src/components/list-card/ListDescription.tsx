import { EditIcon } from "../common/EditIcon";

interface ListDescriptionProps {
  description: string;
  isEditing: boolean;
  editedDescription: string;
  setEditedDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ListDescription = ({
  description,
  isEditing,
  editedDescription,
  setEditedDescription,
  onSubmit,
  onCancel,
}: ListDescriptionProps) => {
  return (
    <>
      {isEditing ? (
        <form onSubmit={onSubmit} className="mt-2 space-y-2">
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            rows={3}
            placeholder="Add a description..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Spara
            </button>
          </div>
        </form>
      ) : (
        <div
          className="group flex items-start gap-1"
          onClick={() => {
            setEditedDescription(description);
          }}
        >
          <p className="text-gray-200 text-sm mt-2">{description}</p>
          <EditIcon className="mt-2" />
        </div>
      )}
    </>
  );
};

export default ListDescription;
