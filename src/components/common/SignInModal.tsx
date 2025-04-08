import SignInButton from "./SignInButton";

interface SignInModalProps {
  onSkip: () => void;
}

export const SignInModal = ({ onSkip }: SignInModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">ToDuo</h2>
        <p className="text-gray-300 mb-6">
          Logga in med ditt google-konto för att använda appens
          samarbetes-funktion
        </p>
        <div className="flex flex-col gap-4">
          <SignInButton />
          <button
            onClick={onSkip}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Kanske senare
          </button>
        </div>
      </div>
    </div>
  );
};
