import ConfirmDialog from "../ConfirmDialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteConfirmDialogProps) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Task"
      message={`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`}
    />
  );
};

export default DeleteConfirmDialog;
