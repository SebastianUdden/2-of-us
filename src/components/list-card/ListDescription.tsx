interface ListDescriptionProps {
  description: string;
  isEditing: boolean;
  editedDescription: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ListDescription = ({
  description,
  isEditing,
  editedDescription,
  onDescriptionChange,
  onSubmit,
  onCancel,
}: ListDescriptionProps) => {
  return (
    <>
      {isEditing ? (
        <form onSubmit={onSubmit} className="mt-2 space-y-2">
          <textarea
            value={editedDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <p className="text-gray-200 text-sm mt-2">{description}</p>
      )}
    </>
  );
};

export default ListDescription;
