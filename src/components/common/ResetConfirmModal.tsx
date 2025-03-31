interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Återställ allt
        </h2>
        <p className="text-gray-300 mb-6">
          Det här kommer att ta bort alla dina sparade uppgifter, listor och
          inställningar. Är du säker på att du vill fortsätta?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Återställ
          </button>
        </div>
      </div>
    </div>
  );
};
