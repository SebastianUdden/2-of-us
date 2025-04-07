interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <p className="text-red-500 text-center">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
